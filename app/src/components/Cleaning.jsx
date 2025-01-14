import React, { useState } from 'react';
import { RefreshCcw, Check, AlertCircle, Table } from 'lucide-react';

const Cleaning = () => {
    const [cleaning, setCleaning] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleCleaning = async () => {
        setCleaning(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/clean-data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to clean data');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Failed to clean data. Please try again.');
        } finally {
            setCleaning(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <RefreshCcw className="w-6 h-6 mr-2 text-blue-500" />
                    Data Cleaning
                </h2>

                {/* Action Section */}
                <div className="mb-6 bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <p className="text-gray-600 text-center max-w-lg">
                            Click the button below to start the data cleaning process.
                            This will handle missing values, remove duplicates, and standardize the data format.
                        </p>
                        <button
                            onClick={handleCleaning}
                            disabled={cleaning}
                            className={`px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 ${cleaning ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            <RefreshCcw className={`w-5 h-5 ${cleaning ? 'animate-spin' : ''}`} />
                            <span>{cleaning ? 'Cleaning Data...' : 'Start Cleaning'}</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <div className="space-y-6">
                        {/* Status Message */}
                        <div
                            className={`p-4 rounded-lg flex items-center ${result.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                        >
                            <Check className="w-5 h-5 mr-2" />
                            {result.message}
                        </div>

                        {/* Dataset Shape Comparison */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium flex items-center mb-4">
                                <Table className="w-5 h-5 mr-2 text-blue-500" />
                                Dataset Transformation
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Initial Shape */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium text-gray-500 mb-2">Initial Dataset</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500">Rows</div>
                                            <div className="text-xl font-bold text-gray-700">{result.initial_shape[0]}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Columns</div>
                                            <div className="text-xl font-bold text-gray-700">{result.initial_shape[1]}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Final Shape */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium text-blue-500 mb-2">Cleaned Dataset</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-blue-500">Rows</div>
                                            <div className="text-xl font-bold text-blue-700">{result.final_shape[0]}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-blue-500">Columns</div>
                                            <div className="text-xl font-bold text-blue-700">{result.final_shape[1]}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cleaning Summary */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Cleaning Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-500">Removed Rows</div>
                                    <div className="text-2xl font-bold text-blue-600 mt-1">{result.removed_rows}</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-500">Removed Columns</div>
                                    <div className="text-2xl font-bold text-blue-600 mt-1">{result.removed_columns}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cleaning;
