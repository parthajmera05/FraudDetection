from flask import Flask, request, jsonify
from uagents import Agent
import joblib

# Load the saved model
model = joblib.load('fraud_detection_model.pkl')

def detect_fraud(transaction):
    # Convert the transaction to a list of features (ensure correct feature names are used)
    transaction_features = [[
        transaction['amount'],  # Replace with actual feature names
        transaction['time'],
        transaction['merchant_id'],
        transaction['customer_id'],
        transaction['location_id']
    ]]
    
    # Predict using the loaded model
    prediction = model.predict(transaction_features)[0]
    
    return prediction == 1

app = Flask(__name__)

ml_agent = Agent(name="ml_fraud_detection")

# API to receive transactions and run the ML model
@app.route('/analyze', methods=['POST'])
def analyze_transaction():
    transaction = request.json
    
    is_fraudulent = detect_fraud(transaction)  # Call the ML model for prediction
    
    if is_fraudulent:
        return jsonify({"status": "Fraudulent transaction detected!"}), 200
    else:
        return jsonify({"status": "Transaction is legitimate"}), 200

if __name__ == '__main__':
    app.run(port=8002)
