from flask import Blueprint, request, jsonify
from firebase_admin import firestore
import uuid
from datetime import datetime, timedelta
import traceback

healthcare_bp = Blueprint('healthcare', __name__)

# Use the central database configuration
from config.database import get_db
db = get_db()

# Import AI services - FIXED IMPORT
try:
    from utils.ai_services import get_health_analysis, test_ai_providers
    AI_SERVICES_AVAILABLE = True
    print("✅ AI services imported successfully")
except ImportError as e:
    print(f"❌ AI service import failed: {e}")
    AI_SERVICES_AVAILABLE = False

    # Fallback functions
    def get_health_analysis(patient_data):
        return {
            "success": True,
            "analysis": "AI services unavailable - using fallback",
            "provider": "fallback",
            "is_real_ai": False
        }
    
    def test_ai_providers():
        return {"fallback": {"working": False, "error": "AI services not available"}}

# PATIENT COLLECTION NAME
PATIENT_COLLECTION = 'patients'

@healthcare_bp.route('/test-providers', methods=['GET'])
def test_ai_providers_route():
    """Test all AI providers"""
    try:
        results = test_ai_providers()
        return jsonify({
            'success': True,
            'providers': results
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Provider test failed: {str(e)}'
        }), 500

@healthcare_bp.route('/patient/<patient_id>/health-report', methods=['GET'])
def get_health_report(patient_id):
    """Generate comprehensive health report for a patient"""
    try:
        print(f"🔍 HEALTH REPORT: Looking for patient: {patient_id}")
        
        # Normalize patient ID
        patient_id = patient_id.strip()
        
        # Get patient data from Firebase
        patients_ref = db.collection(PATIENT_COLLECTION)
        
        # Method 1: Search by patientId field
        query = patients_ref.where('patientId', '==', patient_id).limit(1)
        results = query.get()
        
        if len(results) == 0:
            # Method 2: Search by searchPatientId (case insensitive)
            query = patients_ref.where('searchPatientId', '==', patient_id.lower()).limit(1)
            results = query.get()
            
        if len(results) == 0:
            # Method 3: Try direct document ID
            patient_ref = db.collection(PATIENT_COLLECTION).document(patient_id)
            patient_doc = patient_ref.get()
            if patient_doc.exists:
                patient_data = patient_doc.to_dict()
                actual_patient_id = patient_id
                print(f"✅ Found patient by document ID: {actual_patient_id}")
            else:
                return jsonify({
                    'success': False, 
                    'error': f'Patient not found with ID: {patient_id}',
                    'searched_collection': PATIENT_COLLECTION,
                    'tried_methods': ['patientId_field', 'searchPatientId_field', 'document_id']
                }), 404
        else:
            patient_doc = results[0]
            patient_data = patient_doc.to_dict()
            actual_patient_id = patient_doc.id
            print(f"✅ Found patient by field search: {actual_patient_id}")
        
        print(f"📊 Processing health report for: {patient_data.get('fullName', 'Unknown')}")
        
        # Use the CORRECT function - get_health_analysis with patient_data
        print("🤖 Calling AI for health analysis...")
        analysis_result = get_health_analysis(patient_data)
        
        if not analysis_result["success"]:
            return jsonify({
                'success': False, 
                'error': 'Health analysis failed',
                'ai_error': analysis_result.get('error', 'Unknown AI error')
            }), 500
        
        # Save health report to analyses collection
        report_id = str(uuid.uuid4())
        report_data = {
            'id': report_id,
            'patient_id': actual_patient_id,
            'patient_name': patient_data.get('fullName'),
            'health_report': analysis_result['analysis'],
            'timestamp': datetime.now().isoformat(),
            'type': 'comprehensive_health_report',
            'organization_id': patient_data.get('organizationId'),
            'ai_provider': analysis_result.get('provider', 'unknown'),
            'is_real_ai': analysis_result.get('is_real_ai', False)
        }
        
        try:
            db.collection('healthcare_analyses').document(report_id).set(report_data)
            print("💾 Health report saved to database")
        except Exception as e:
            print(f"⚠️ Could not save to database: {e}")
        
        # Prepare response data
        age = _calculate_age(patient_data.get('dateOfBirth'))
        bmi = patient_data.get('bmi', 'Unknown')
        
        return jsonify({
            'success': True,
            'health_report': analysis_result['analysis'],
            'report_id': report_id,
            'ai_provider': analysis_result.get('provider', 'unknown'),
            'is_real_ai': analysis_result.get('is_real_ai', False),
            'patient': {
                'name': patient_data.get('fullName'),
                'age': age,
                'blood_group': patient_data.get('bloodGroup', 'Unknown'),
                'bmi': bmi,
                'critical_factors': {
                    'smoking': patient_data.get('smokingStatus', 'Unknown'),
                    'bmi_category': _get_bmi_category(float(bmi)) if bmi and bmi != 'Unknown' and bmi.replace('.', '').isdigit() else 'Unknown',
                    'risk_factors': patient_data.get('riskFactors', [])
                }
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error in health report: {str(e)}")
        print(f"🔍 Stack trace: {traceback.format_exc()}")
        return jsonify({
            'success': False, 
            'error': f'Health report generation failed: {str(e)}'
        }), 500

@healthcare_bp.route('/patient/<patient_id>/medication-review', methods=['GET'])
def medication_review(patient_id):
    """AI-powered medication review and interactions check"""
    try:
        print(f"💊 MEDICATION REVIEW: Looking for patient: {patient_id}")
        
        # Get patient data
        patients_ref = db.collection(PATIENT_COLLECTION)
        query = patients_ref.where('patientId', '==', patient_id).limit(1)
        results = query.get()
        
        if len(results) == 0:
            query = patients_ref.where('searchPatientId', '==', patient_id.lower()).limit(1)
            results = query.get()
            
        if len(results) == 0:
            return jsonify({
                'success': False, 
                'error': f'Patient not found: {patient_id}'
            }), 404
        
        patient_doc = results[0]
        patient_data = patient_doc.to_dict()
        
        medications = patient_data.get('currentMedications', [])
        chronic_conditions = patient_data.get('chronicConditions', [])
        allergies = patient_data.get('allergies', [])
        
        if not medications:
            return jsonify({
                'success': True, 
                'message': 'No current medications found for this patient',
                'recommendation': 'Consider reviewing medication history if available',
                'patient': patient_data.get('fullName')
            })
        
        # Create medication-focused patient data
        med_review_data = patient_data.copy()
        med_review_data['analysis_type'] = 'medication_review'
        
        print("🤖 Calling AI for medication review...")
        analysis_result = get_health_analysis(med_review_data)
        
        if not analysis_result["success"]:
            return jsonify({
                'success': False,
                'error': 'AI service unavailable for medication review'
            }), 500
        
        return jsonify({
            'success': True,
            'medication_review': analysis_result['analysis'],
            'medications_analyzed': medications,
            'patient': patient_data.get('fullName'),
            'conditions': chronic_conditions,
            'allergies': allergies,
            'ai_provider': analysis_result.get('provider', 'unknown'),
            'is_real_ai': analysis_result.get('is_real_ai', False)
        })
        
    except Exception as e:
        print(f"❌ Error in medication review: {str(e)}")
        return jsonify({
            'success': False, 
            'error': f'Medication review failed: {str(e)}'
        }), 500

@healthcare_bp.route('/patient/<patient_id>/predictive-health', methods=['GET'])
def predictive_health_analysis(patient_id):
    """Predict future health risks and provide preventive care"""
    try:
        print(f"🔮 PREDICTIVE HEALTH: Looking for patient: {patient_id}")
        
        # Get patient data
        patients_ref = db.collection(PATIENT_COLLECTION)
        query = patients_ref.where('patientId', '==', patient_id).limit(1)
        results = query.get()
        
        if len(results) == 0:
            query = patients_ref.where('searchPatientId', '==', patient_id.lower()).limit(1)
            results = query.get()
            
        if len(results) == 0:
            return jsonify({
                'success': False, 
                'error': f'Patient not found: {patient_id}'
            }), 404
        
        patient_doc = results[0]
        patient_data = patient_doc.to_dict()
        
        # Create predictive-focused patient data
        predictive_data = patient_data.copy()
        predictive_data['analysis_type'] = 'predictive_health'
        
        print("🤖 Calling AI for predictive health analysis...")
        analysis_result = get_health_analysis(predictive_data)
        
        if not analysis_result["success"]:
            return jsonify({
                'success': False,
                'error': 'AI service unavailable for predictive analysis'
            }), 500
        
        # Save predictive analysis
        analysis_id = str(uuid.uuid4())
        analysis_data = {
            'id': analysis_id,
            'patient_id': patient_doc.id,
            'patient_name': patient_data.get('fullName'),
            'predictive_analysis': analysis_result['analysis'],
            'timestamp': datetime.now().isoformat(),
            'type': 'predictive_health_analysis',
            'organization_id': patient_data.get('organizationId'),
            'ai_provider': analysis_result.get('provider', 'unknown'),
            'is_real_ai': analysis_result.get('is_real_ai', False)
        }
        
        try:
            db.collection('healthcare_predictive_analyses').document(analysis_id).set(analysis_data)
            print("💾 Predictive analysis saved to database")
        except Exception as e:
            print(f"⚠️ Could not save predictive analysis: {e}")
        
        age = _calculate_age(patient_data.get('dateOfBirth'))
        bmi = patient_data.get('bmi', 'Unknown')
        smoking_status = patient_data.get('smokingStatus', 'Unknown')
        
        return jsonify({
            'success': True,
            'predictive_analysis': analysis_result['analysis'],
            'analysis_id': analysis_id,
            'patient': {
                'name': patient_data.get('fullName'),
                'age': age,
                'bmi': bmi,
                'smoking_status': smoking_status
            },
            'ai_provider': analysis_result.get('provider', 'unknown'),
            'is_real_ai': analysis_result.get('is_real_ai', False)
        })
        
    except Exception as e:
        print(f"❌ Error in predictive health analysis: {str(e)}")
        return jsonify({
            'success': False, 
            'error': f'Predictive health analysis failed: {str(e)}'
        }), 500

# Helper functions
def _calculate_age(date_of_birth):
    """Calculate age from date of birth"""
    try:
        if not date_of_birth:
            return "Unknown"
        
        dob = datetime.strptime(date_of_birth, "%Y-%m-%d")
        today = datetime.now()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return age
    except:
        return "Unknown"

def _get_bmi_category(bmi):
    """Get BMI category"""
    try:
        bmi_float = float(bmi)
        if bmi_float < 18.5:
            return "Underweight"
        elif 18.5 <= bmi_float < 25:
            return "Normal weight"
        elif 25 <= bmi_float < 30:
            return "Overweight"
        else:
            return "Obese"
    except:
        return "Unknown"

@healthcare_bp.route('/patients', methods=['GET'])
def get_patients():
    """Get REAL patients from Firebase"""
    try:
        org_id = request.args.get('organization_id')
        
        if not org_id:
            return jsonify({'success': False, 'error': 'Organization ID required'}), 400
        
        patients_ref = db.collection(PATIENT_COLLECTION)
        query = patients_ref.where('organizationId', '==', org_id)
        results = query.get()
        
        patients = []
        for doc in results:
            patient_data = doc.to_dict()
            patients.append({
                'id': patient_data.get('patientId'),
                'document_id': doc.id,
                'fullName': patient_data.get('fullName'),
                'firstName': patient_data.get('firstName'),
                'lastName': patient_data.get('lastName'),
                'age': _calculate_age(patient_data.get('dateOfBirth')),
                'gender': patient_data.get('gender'),
                'bloodGroup': patient_data.get('bloodGroup'),
                'bmi': patient_data.get('bmi'),
                'chronicConditions': patient_data.get('chronicConditions', []),
                'currentMedications': patient_data.get('currentMedications', []),
                'smokingStatus': patient_data.get('smokingStatus'),
                'last_visit': patient_data.get('updatedAt'),
                'contact_info': {
                    'email': patient_data.get('email'),
                    'phone': patient_data.get('phone')
                }
            })
        
        return jsonify({
            'success': True,
            'patients': patients,
            'total_count': len(patients),
            'collection_used': PATIENT_COLLECTION
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@healthcare_bp.route('/test-patient-search', methods=['GET'])
def test_patient_search():
    """Test endpoint to debug patient search"""
    try:
        patient_id = request.args.get('patient_id')
        if not patient_id:
            return jsonify({'success': False, 'error': 'patient_id parameter required'})
        
        print(f"🔍 Testing search for: {patient_id}")
        
        # Method 1: Direct document access
        patient_ref = db.collection(PATIENT_COLLECTION).document(patient_id)
        patient_doc = patient_ref.get()
        
        if patient_doc.exists:
            return jsonify({
                'success': True,
                'method': 'direct_document',
                'patient': patient_doc.to_dict()
            })
        
        # Method 2: Search by patientId field
        patients_ref = db.collection(PATIENT_COLLECTION)
        query = patients_ref.where('patientId', '==', patient_id).limit(1)
        results = query.get()
        
        if len(results) > 0:
            return jsonify({
                'success': True,
                'method': 'patientId_field',
                'patient': results[0].to_dict(),
                'document_id': results[0].id
            })
        
        # Method 3: Search by searchPatientId field (case insensitive)
        query = patients_ref.where('searchPatientId', '==', patient_id.lower()).limit(1)
        results = query.get()
        
        if len(results) > 0:
            return jsonify({
                'success': True,
                'method': 'searchPatientId_field',
                'patient': results[0].to_dict(),
                'document_id': results[0].id
            })
        
        return jsonify({
            'success': False,
            'error': f'Patient not found with any search method: {patient_id}',
            'searched_collection': PATIENT_COLLECTION
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500