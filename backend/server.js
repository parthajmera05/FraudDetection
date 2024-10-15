const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
app.use(bodyParser.json());
app.use(cors()) ; 
// Endpoint for frontend to send transactions
app.post('/analyze-transaction', async (req, res) => {
    const transaction = {
        amount: parseFloat(req.body.amount), // Convert to float
        time: parseFloat(req.body.time), // Convert to float
        merchant_id: parseFloat(req.body.merchant_id), // Convert to float
        customer_id: parseFloat(req.body.customer_id), // Convert to float
        location_id: parseFloat(req.body.location_id), // Convert to float
    };
    console.log("Received transaction:", transaction);  // Log the incoming transaction

    try {
        // Step 1: Send transaction to fraud detection uAgent (suspicion check)
        const fraudCheckResponse = await axios.post('http://localhost:8001/transaction', transaction);
        console.log("Fraud check response:", fraudCheckResponse.data);  // Log the response from uAgent

        const fraudCheckResult = fraudCheckResponse.data.status;

        if (fraudCheckResult === "Suspicious, needs further analysis") {
            // Step 2: If suspicious, send transaction to ML uAgent for analysis
            const mlAnalysisResponse = await axios.post('http://localhost:8002/analyze', transaction);
            console.log("ML analysis response:", mlAnalysisResponse.data);  // Log the ML response
            const mlResult = mlAnalysisResponse.data.status;
            return res.json({status: mlResult});
        } else {
            return res.json({status: "Transaction is normal"});
        }
    } catch (error) {
        console.error("Error in fraud detection process:", error.message);  // Log the error message
        console.error("Request data:", transaction);  // Log the request data causing the error
        console.error(error.response ? error.response.data : error);  // Log detailed error info
        return res.status(500).json({error: "Internal Server Error"});
    }
});


app.listen(3000, () => {
    console.log('Backend server running on port 3000');
});
