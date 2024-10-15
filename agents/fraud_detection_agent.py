from flask import Flask, request, jsonify
from uagents import Agent, Context

app = Flask(__name__)

agent = Agent(name="fraud_detection_agent")

# Basic logic for checking suspicious transactions
def is_suspicious(transaction):
    if transaction['amount'] > 500:  # Just an example threshold
        return True
    return False

# API Endpoint to handle incoming transaction data
@app.route('/transaction', methods=['POST'])
def transaction():
    try:
        transaction_data = request.json
        print("Received transaction data:", transaction_data)  # Log received data
        
        # Ensure that the fields exist
        if not all(key in transaction_data for key in ['amount','time', 'merchant_id', 'customer_id', 'location_id']):
            return jsonify({'error': 'Missing data'}), 400

        # Convert to appropriate types if needed
        amount = float(transaction_data['amount'])  # Ensure amount is a float
        time = float(transaction_data['time']) # Ensure balance is a float

        # Example logic to determine if the transaction is suspicious
        if amount > 500:
            return jsonify({'status': 'Suspicious, needs further analysis'})
        
        return jsonify({'status': 'Transaction is normal'})
    except Exception as e:
        print(f"Error processing transaction: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(port=8001)  # Expose uAgent on localhost port 8001
