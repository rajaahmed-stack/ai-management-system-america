from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime, timedelta
import random
from firebase_admin import firestore

finance_bp = Blueprint('finance', __name__)
db = firestore.client()

class FinanceAI:
    def __init__(self):
        self.fraud_model = None
    
    def detect_fraud(self, transaction):
        """AI-powered fraud detection"""
        # Mock implementation - replace with real model
        amount = transaction.get('amount', 0)
        location = transaction.get('location', '')
        time = transaction.get('time', '')
        transaction_type = transaction.get('type', '')
        
        risk_score = 0
        
        # Simple rule-based fraud detection
        if amount > 10000:
            risk_score += 30
        if location and 'international' in location.lower():
            risk_score += 25
        if 'unusual' in transaction_type.lower():
            risk_score += 20
        if time and int(time.split(':')[0]) in [2, 3, 4]:  # Late night transactions
            risk_score += 15
        
        is_fraud = risk_score > 50
        
        return {
            'is_fraud': is_fraud,
            'risk_score': min(risk_score, 100),
            'reasons': [
                'High amount transaction' if amount > 10000 else None,
                'International transaction' if location and 'international' in location.lower() else None,
                'Unusual transaction type' if 'unusual' in transaction_type.lower() else None,
                'Late night transaction' if time and int(time.split(':')[0]) in [2, 3, 4] else None
            ],
            'recommendation': 'Review immediately' if is_fraud else 'No action needed'
        }
    
    def assess_credit_risk(self, applicant_data):
        """AI credit risk assessment"""
        # Mock implementation
        income = applicant_data.get('income', 0)
        debt = applicant_data.get('debt', 0)
        credit_score = applicant_data.get('credit_score', 0)
        employment_length = applicant_data.get('employment_length', 0)
        
        risk_score = 0
        
        if income > 0:
            debt_to_income = debt / income
            if debt_to_income > 0.4:
                risk_score += 40
            elif debt_to_income > 0.3:
                risk_score += 20
        
        if credit_score < 600:
            risk_score += 30
        elif credit_score < 700:
            risk_score += 15
        
        if employment_length < 2:
            risk_score += 20
        
        risk_level = 'high' if risk_score > 50 else 'medium' if risk_score > 25 else 'low'
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'approval_probability': max(0, 100 - risk_score),
            'recommended_credit_limit': min(income * 0.3, 10000) if risk_level == 'low' else min(income * 0.2, 5000),
            'conditions': ['Income verification required'] if risk_level == 'high' else ['Standard terms apply']
        }

finance_ai = FinanceAI()

@finance_bp.route('/admin/dashboard', methods=['GET'])
def finance_admin_dashboard():
    """Finance admin dashboard"""
    org_id = request.args.get('organization_id')
    
    dashboard_data = {
        'total_customers': 1250,
        'total_accounts': 1850,
        'total_assets': 12500000,
        'fraud_cases_this_month': 3,
        'pending_loan_applications': 15,
        'recent_transactions': [
            {'account': '****1234', 'amount': 250.00, 'type': 'debit', 'status': 'completed'},
            {'account': '****5678', 'amount': 1500.00, 'type': 'credit', 'status': 'completed'}
        ],
        'alerts': [
            {'type': 'fraud', 'description': 'Suspicious transaction detected', 'severity': 'high'},
            {'type': 'application', 'description': 'New loan application submitted', 'severity': 'medium'}
        ]
    }
    
    return jsonify({
        'success': True,
        'dashboard': dashboard_data
    })

@finance_bp.route('/transactions', methods=['GET'])
def get_transactions():
    """Get financial transactions"""
    # Mock transactions data
    transactions = [
        {
            'id': str(uuid.uuid4()),
            'account_number': '****1234',
            'amount': 250.00,
            'type': 'debit',
            'description': 'Grocery Store Purchase',
            'date': '2024-01-15',
            'status': 'completed',
            'balance': 1250.50
        },
        {
            'id': str(uuid.uuid4()),
            'account_number': '****1234',
            'amount': 1500.00,
            'type': 'credit',
            'description': 'Salary Deposit',
            'date': '2024-01-14',
            'status': 'completed',
            'balance': 1500.50
        }
    ]
    
    return jsonify({
        'success': True,
        'transactions': transactions
    })

@finance_bp.route('/detect-fraud', methods=['POST'])
def detect_fraud():
    """AI fraud detection endpoint"""
    data = request.json
    transaction = data.get('transaction', {})
    
    fraud_analysis = finance_ai.detect_fraud(transaction)
    
    return jsonify({
        'success': True,
        'fraud_analysis': fraud_analysis
    })

@finance_bp.route('/assess-credit', methods=['POST'])
def assess_credit():
    """AI credit risk assessment"""
    data = request.json
    applicant_data = data.get('applicant_data', {})
    
    credit_assessment = finance_ai.assess_credit_risk(applicant_data)
    
    return jsonify({
        'success': True,
        'credit_assessment': credit_assessment
    })

@finance_bp.route('/accounts', methods=['GET'])
def get_accounts():
    """Get financial accounts"""
    accounts = [
        {
            'id': str(uuid.uuid4()),
            'account_number': '****1234',
            'type': 'checking',
            'balance': 1250.50,
            'currency': 'USD',
            'status': 'active'
        },
        {
            'id': str(uuid.uuid4()),
            'account_number': '****5678',
            'type': 'savings',
            'balance': 5000.00,
            'currency': 'USD',
            'status': 'active'
        }
    ]
    
    return jsonify({
        'success': True,
        'accounts': accounts
    })