from flask import Blueprint, request, jsonify
from firebase_admin import firestore
import uuid
from datetime import datetime

education_bp = Blueprint('education', __name__)

# Use the central database configuration
from config.database import get_db
db = get_db()

@education_bp.route('/admin/dashboard', methods=['GET'])
def education_admin_dashboard():
    """Get education dashboard data"""
    try:
        org_id = request.args.get('organization_id')
        
        if not org_id:
            return jsonify({'success': False, 'error': 'Organization ID required'}), 400
        
        # Get data from Firebase
        students_ref = db.collection('education_students')
        students_query = students_ref.where('organization_id', '==', org_id).get()
        
        total_students = len(students_query)
        
        dashboard_data = {
            'total_students': total_students,
            'total_courses': 15,
            'recent_students': [],
            'last_updated': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'dashboard': dashboard_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@education_bp.route('/students', methods=['GET'])
def get_students():
    """Get students from Firebase"""
    try:
        org_id = request.args.get('organization_id')
        
        if not org_id:
            return jsonify({'success': False, 'error': 'Organization ID required'}), 400
        
        students_ref = db.collection('education_students')
        query = students_ref.where('organization_id', '==', org_id)
        results = query.get()
        
        students = []
        for doc in results:
            student_data = doc.to_dict()
            students.append({
                'id': student_data.get('id'),
                'name': student_data.get('name'),
                'age': student_data.get('age'),
                'grade': student_data.get('grade'),
                'subjects': student_data.get('subjects', [])
            })
        
        return jsonify({
            'success': True,
            'students': students,
            'total_count': len(students)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@education_bp.route('/add-student', methods=['POST'])
def add_student():
    """Add student to Firebase"""
    try:
        data = request.json
        org_id = data.get('organization_id')
        
        if not org_id:
            return jsonify({'success': False, 'error': 'Organization ID required'}), 400
        
        student_id = str(uuid.uuid4())
        student_data = {
            'id': student_id,
            'name': data.get('name'),
            'age': data.get('age'),
            'grade': data.get('grade'),
            'subjects': data.get('subjects', []),
            'organization_id': org_id,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        # Save to Firebase
        db.collection('education_students').document(student_id).set(student_data)
        
        return jsonify({
            'success': True,
            'message': 'Student added successfully',
            'student_id': student_id,
            'student': student_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@education_bp.route('/test', methods=['GET'])
def test_education():
    """Test education route"""
    return jsonify({
        'success': True,
        'message': 'Education routes are working!',
        'timestamp': datetime.now().isoformat()
    })