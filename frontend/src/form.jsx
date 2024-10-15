// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import ResponsiveAppBar from './components/appbar';
import {RotatingLines} from 'react-loader-spinner';
import { useForm } from 'react-hook-form';


function Form() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true); // Show the loading spinner

        // Introduce a delay for the loading effect
        setTimeout(async () => {
            try {
                const response = await axios.post('http://localhost:3000/analyze-transaction', data);
                setResult(response.data.status);
            } catch (error) {
                console.error('Error analyzing transaction', error);
                setResult('Error occurred while analyzing the transaction.');
            } finally {
                setLoading(false); // Stop loading after the result is fetched
            }
        }, 500); // Delay of 500 milliseconds before processing

        reset(); // Reset form fields after submission
    };

    return (
            <>
            {/* Navbar */}
            <ResponsiveAppBar />

            {/* Main Content */}
            <div className='form-container'>
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Analyze Your Transaction</h2>

                {/* Form */}
               
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Amount</label>
                        <input 
                            type="number"
                            {...register("amount", { required: "Amount is required", min: { value: 0, message: "Amount must be positive" } })}
                            className={`p-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Time</label>
                        <input 
                            type="number"
                            {...register("time", { required: "Time is required" })}
                            className={`p-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.time && <span className="text-red-500 text-sm">{errors.time.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Merchant ID</label>
                        <input 
                            type="text"
                            {...register("merchant_id", { required: "Merchant ID is required" })}
                            className={`p-2 border ${errors.merchant_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.merchant_id && <span className="text-red-500 text-sm">{errors.merchant_id.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Customer ID</label>
                        <input 
                            type="text"
                            {...register("customer_id", { required: "Customer ID is required" })}
                            className={`p-2 border ${errors.customer_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.customer_id && <span className="text-red-500 text-sm">{errors.customer_id.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Location ID</label>
                        <input 
                            type="text"
                            {...register("location_id", { required: "Location ID is required" })}
                            className={`p-2 border ${errors.location_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.location_id && <span className="text-red-500 text-sm">{errors.location_id.message}</span>}
                    </div>

                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
                        Analyze Transaction
                    </button>
                </form>
               

                {/* Result Section */}
                <div className="mt-8 w-full max-w-md">
                    {loading ? (
                        <RotatingLines /> 
                    ) : result && (
                        <h3 className={`text-center text-2xl font-bold mt-4 ${result.includes('Fraudulent') ? 'text-red-600' : 'text-green-600'}`}>
                            {result}
                        </h3>
                    )}
                </div>
            </div>
        </div>
        </>
       
    );
}

export default Form;

