from flask import Blueprint, request, jsonify
from firebase_admin import auth, firestore
import uuid
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# Use the central database configuration
from config.database import get_db
db = get_db()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new organization and admin user"""
    try:
        data = request.json
        print(f"Registration attempt: {data}")
        
        # Required fields
        required_fields = ['email', 'password', 'name', 'industry', 'organization_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Create organization first
        org_id = str(uuid.uuid4())
        org_data = {
            'id': org_id,
            'name': data['organization_name'],
            'industry': data['industry'],
            'admin_id': 'pending',  # Will update after user creation
            'subscription': 'basic',
            'settings': {},
            'created_at': datetime.now().isoformat(),
            'status': 'active'
        }
        
        # Save organization to Firebase
        org_ref = db.collection('organizations').document(org_id)
        org_ref.set(org_data)
        print(f"Organization created: {org_id}")
        
        # Create user in Firebase Auth
        try:
            user = auth.create_user(
                email=data['email'],
                password=data['password'],
                display_name=data['name']
            )
            print(f"Firebase Auth user created: {user.uid}")
        except Exception as auth_error:
            # If auth fails, delete the organization
            org_ref.delete()
            return jsonify({
                'success': False,
                'error': f'Authentication failed: {str(auth_error)}'
            }), 400
        
        # Create user document in Firestore
        user_data = {
            'id': user.uid,
            'email': data['email'],
            'name': data['name'],
            'industry': data['industry'],
            'role': 'admin',
            'organization_id': org_id,
            'permissions': ['admin', 'manage_users', 'view_reports', 'manage_data'],
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'status': 'active'
        }
        
        user_ref = db.collection('users').document(user.uid)
        user_ref.set(user_data)
        
        # Update organization with admin ID
        org_ref.update({'admin_id': user.uid})
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user_id': user.uid,
            'organization_id': org_id,
            'user': user_data,
            'organization': org_data
        })
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'error': 'Email and password are required'
            }), 400
        
        # Check Firestore for user
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).limit(1)
        results = query.get()
        
        if len(results) == 0:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = results[0].to_dict()
        
        # Get organization data
        org_ref = db.collection('organizations').document(user_data['organization_id'])
        org_data = org_ref.get().to_dict()
        
        # Generate a simple token
        import hashlib
        token = hashlib.sha256(f"{email}{datetime.now().isoformat()}".encode()).hexdigest()
        
        # Store session
        session_data = {
            'user_id': user_data['id'],
            'email': email,
            'organization_id': user_data['organization_id'],
            'login_time': datetime.now().isoformat()
        }
        db.collection('sessions').document(token).set(session_data)
        
        return jsonify({
            'success': True,
            'user': user_data,
            'organization': org_data,
            'token': token,
            'message': 'Login successful'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500

@auth_bp.route('/users', methods=['GET'])
def get_users():
    """Get all users in organization"""
    try:
        org_id = request.args.get('organization_id')
        token = request.args.get('token')
        
        if not org_id:
            return jsonify({
                'success': False,
                'error': 'Organization ID is required'
            }), 400
        
        # Verify token (simplified)
        if token:
            session_ref = db.collection('sessions').document(token)
            session_data = session_ref.get()
            if not session_data.exists:
                return jsonify({'success': False, 'error': 'Invalid token'}), 401
        
        users_ref = db.collection('users')
        query = users_ref.where('organization_id', '==', org_id)
        results = query.get()
        
        users = [doc.to_dict() for doc in results]
        
        return jsonify({
            'success': True,
            'users': users,
            'count': len(users)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/test', methods=['GET'])
def test_auth():
    """Test auth route"""
    return jsonify({
        'success': True,
        'message': 'Auth routes are working!',
        'timestamp': datetime.now().isoformat()
    })