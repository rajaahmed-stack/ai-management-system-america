import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from openai import OpenAI

# Add the directory containing this file to sys.path so that 'config' can be found
sys.path.insert(0, os.path.dirname(__file__))

app = Flask(__name__)
CORS(app)

# Initialize Firebase through config
from config.database import initialize_firebase, get_db
db = initialize_firebase()

# Industry configuration
INDUSTRIES = {
    'Healthcare': {
        'roles': ['admin', 'doctor', 'nurse', 'staff', 'patient'],
        'modules': ['patients', 'appointments', 'medical_records', 'prescriptions', 'billing'],
        'description': 'Medical diagnostics, patient care, healthcare analytics'
    },
    'Finance': {
        'roles': ['admin', 'manager', 'analyst', 'advisor', 'customer'],
        'modules': ['accounts', 'transactions', 'investments', 'loans', 'fraud_detection'],
        'description': 'Fraud detection, risk analysis, investment insights'
    },
    'Retail': {
        'roles': ['admin', 'manager', 'sales_staff', 'inventory_manager', 'customer'],
        'modules': ['products', 'inventory', 'sales', 'customers', 'suppliers'],
        'description': 'Customer analytics, inventory management, sales forecasting'
    },
    'Education': {
        'roles': ['admin', 'teacher', 'student', 'staff', 'parent'],
        'modules': ['courses', 'students', 'grades', 'attendance', 'resources'],
        'description': 'Personalized learning, student analytics, administrative automation'
    },
    'Legal': {
        'roles': ['admin', 'lawyer', 'paralegal', 'client', 'staff'],
        'modules': ['cases', 'clients', 'documents', 'billing', 'calendar'],
        'description': 'Document analysis, case prediction, legal research automation'
    },
    'Music': {
        'roles': ['admin', 'artist', 'producer', 'manager', 'listener'],
        'modules': ['tracks', 'albums', 'royalties', 'concerts', 'analytics'],
        'description': 'Music analysis, recommendation engines, royalty tracking'
    },
    'Manufacturing': {
        'roles': ['admin', 'manager', 'engineer', 'operator', 'quality_check'],
        'modules': ['production', 'inventory', 'quality', 'maintenance', 'supply_chain'],
        'description': 'Predictive maintenance, quality control, supply chain'
    },
    'Technology': {
        'roles': ['admin', 'developer', 'manager', 'support', 'client'],
        'modules': ['projects', 'tickets', 'deployments', 'monitoring', 'security'],
        'description': 'Software development, IT operations, cybersecurity'
    },
    'Logistics': {
        'roles': ['admin', 'dispatcher', 'driver', 'warehouse_manager', 'customer'],
        'modules': ['shipments', 'vehicles', 'routes', 'inventory', 'tracking'],
        'description': 'Route optimization, fleet management, delivery tracking'
    },
    'RealEstate': {
        'roles': ['admin', 'agent', 'broker', 'buyer', 'seller'],
        'modules': ['properties', 'listings', 'clients', 'appointments', 'contracts'],
        'description': 'Property valuation, market analysis, customer management'
    }
}

@app.route('/')
def home():
    return jsonify({
        "message": "Nexus AI Platform API - Multi Industry Solution",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "industries": list(INDUSTRIES.keys())
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Nexus AI Platform Backend is running',
        'version': '1.0.0',
        'database': 'Firebase Connected',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/industries', methods=['GET'])
def get_industries():
    """Get all available industries with their configurations"""
    return jsonify({
        'success': True,
        'industries': INDUSTRIES
    })

@app.route('/api/test-db', methods=['GET'])
def test_database():
    """Test Firebase database connection"""
    try:
        # Test write operation
        test_ref = db.collection('system_tests').document('connection_test')
        test_data = {
            'message': 'Database connection test from Nexus AI',
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        }
        test_ref.set(test_data)
        
        # Test read operation
        doc = test_ref.get()
        if doc.exists:
            return jsonify({
                'success': True,
                'message': 'Firebase database is working perfectly!',
                'data': doc.to_dict()
            })
        else:
            return jsonify({'success': False, 'error': 'Database write failed'})
            
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': f'Database connection failed: {str(e)}'
        }), 500

# Import and register routes AFTER db is initialized
def register_routes():
    from routes.auth_routes import auth_bp
    from routes.healthcare_routes import healthcare_bp
    from routes.education_routes import education_bp
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(healthcare_bp, url_prefix='/api/healthcare')
    app.register_blueprint(education_bp, url_prefix='/api/education')
    
    print("✅ Routes registered successfully")

# Register routes so they are available when Gunicorn imports the app
register_routes()

# Initialize OpenAI client with your API key from environment variables
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.route('/api/ai/ask', methods=['POST'])
def ask_ai():
    data = request.get_json()
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({'error': 'Missing prompt'}), 400

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # or "gpt-4"
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        response = completion.choices[0].message.content
        return jsonify({'response': response})
    except Exception as e:
        print(f"OpenAI error: {e}")
        return jsonify({'error': 'AI request failed'}), 500

if __name__ == '__main__':
    print("🚀 Starting Nexus AI Multi-Industry Platform...")
    print("📊 Connected to: nexus-ai-app-e1df1 Firebase Project")
    print("🔗 API Server: http://localhost:5000")
    print("🏥 Healthcare: http://localhost:5000/api/healthcare/admin/dashboard")
    print("🎓 Education: http://localhost:5000/api/education/admin/dashboard")
    print("---")
    print("✅ To test: curl http://localhost:5000/api/health")
    print("✅ Database test: curl http://localhost:5000/api/test-db")
    
    app.run(debug=True, host='0.0.0.0', port=5000)