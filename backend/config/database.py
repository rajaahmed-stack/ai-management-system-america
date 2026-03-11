import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Global database instance
db = None

def initialize_firebase():
    global db
    if not firebase_admin._apps:
        # Get credentials from environment variable
        cred_json = os.environ.get('FIREBASE_CREDENTIALS')
        if cred_json:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
        else:
            # Fallback for local development (if you still want to use a file)
            # Make sure this file is not committed to the repo!
            cred = credentials.Certificate("nexus-ai-app-e1df1-firebase-adminsdk-fbsvc-32089d5d4f.json")
        
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("✅ Firebase initialized successfully")
    return db

def get_db():
    global db
    if db is None:
        return initialize_firebase()
    return db