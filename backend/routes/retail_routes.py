from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from firebase_admin import firestore

retail_bp = Blueprint('retail', __name__)
db = firestore.client()

class RetailAI:
    def __init__(self):
        self.recommendation_model = None
    
    def get_recommendations(self, customer_data, purchase_history):
        """AI product recommendations"""
        # Mock implementation
        customer_interests = customer_data.get('interests', [])
        past_purchases = [item.get('category') for item in purchase_history]
        
        # Simple recommendation logic
        recommendations = []
        
        if 'electronics' in customer_interests or 'electronics' in past_purchases:
            recommendations.extend([
                {'product': 'Wireless Earbuds', 'category': 'electronics', 'confidence': 0.85},
                {'product': 'Smart Watch', 'category': 'electronics', 'confidence': 0.78}
            ])
        
        if 'clothing' in customer_interests or 'clothing' in past_purchases:
            recommendations.extend([
                {'product': 'Winter Jacket', 'category': 'clothing', 'confidence': 0.72},
                {'product': 'Running Shoes', 'category': 'clothing', 'confidence': 0.68}
            ])
        
        if 'books' in customer_interests or 'books' in past_purchases:
            recommendations.extend([
                {'product': 'Bestseller Novel', 'category': 'books', 'confidence': 0.81},
                {'product': 'Cookbook', 'category': 'books', 'confidence': 0.65}
            ])
        
        # Sort by confidence and return top 4
        recommendations.sort(key=lambda x: x['confidence'], reverse=True)
        return recommendations[:4]
    
    def predict_sales(self, product_data, historical_sales):
        """AI sales forecasting"""
        # Mock implementation
        base_sales = 100
        seasonality_factor = 1.2  # Assume 20% increase for demo
        trend_factor = 1.1
        
        predicted_sales = base_sales * seasonality_factor * trend_factor
        
        return {
            'predicted_sales': round(predicted_sales),
            'confidence_interval': f"{round(predicted_sales * 0.8)}-{round(predicted_sales * 1.2)}",
            'factors': ['Seasonal demand', 'Market trends', 'Historical performance'],
            'recommendation': 'Increase stock' if predicted_sales > 120 else 'Maintain current levels'
        }

retail_ai = RetailAI()

@retail_bp.route('/admin/dashboard', methods=['GET'])
def retail_admin_dashboard():
    """Retail admin dashboard"""
    dashboard_data = {
        'total_products': 1250,
        'total_customers': 8500,
        'daily_sales': 12500,
        'pending_orders': 45,
        'low_stock_items': 12,
        'recent_orders': [
            {'order_id': 'ORD-001', 'customer': 'John Smith', 'amount': 250.00, 'status': 'delivered'},
            {'order_id': 'ORD-002', 'customer': 'Maria Garcia', 'amount': 89.99, 'status': 'shipped'}
        ],
        'top_products': [
            {'product': 'Wireless Earbuds', 'sales': 150},
            {'product': 'Smart Watch', 'sales': 120},
            {'product': 'Winter Jacket', 'sales': 95}
        ]
    }
    
    return jsonify({
        'success': True,
        'dashboard': dashboard_data
    })

@retail_bp.route('/products', methods=['GET'])
def get_products():
    """Get retail products"""
    products = [
        {
            'id': str(uuid.uuid4()),
            'name': 'Wireless Earbuds',
            'category': 'electronics',
            'price': 99.99,
            'stock_quantity': 150,
            'status': 'in_stock',
            'rating': 4.5
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Winter Jacket',
            'category': 'clothing',
            'price': 79.99,
            'stock_quantity': 45,
            'status': 'in_stock',
            'rating': 4.2
        }
    ]
    
    return jsonify({
        'success': True,
        'products': products
    })

@retail_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    """AI product recommendations"""
    data = request.json
    customer_data = data.get('customer_data', {})
    purchase_history = data.get('purchase_history', [])
    
    recommendations = retail_ai.get_recommendations(customer_data, purchase_history)
    
    return jsonify({
        'success': True,
        'recommendations': recommendations
    })

@retail_bp.route('/predict-sales', methods=['POST'])
def predict_sales():
    """AI sales forecasting"""
    data = request.json
    product_data = data.get('product_data', {})
    historical_sales = data.get('historical_sales', [])
    
    sales_prediction = retail_ai.predict_sales(product_data, historical_sales)
    
    return jsonify({
        'success': True,
        'sales_prediction': sales_prediction
    })