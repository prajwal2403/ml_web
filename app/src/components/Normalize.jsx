import React, { useState } from 'react';
import { SlidersHorizontal, Table, Check, AlertCircle, ArrowDownUp } from 'lucide-react';

const NormalizeComponent = () => {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleNormalization = async (method) => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/feature-engineering/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ method })
            });

            if (!response.ok) {
                throw new Error('Feature engineering failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Failed to process data. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Methods Information */}
                <div className="border rounded-lg shadow mb-6">
                    <div className="p-4 border-b">
                        <h2 className="flex items-center text-xl font-bold">
                            <SlidersHorizontal className="w-6 h-6 mr-2 text-blue-500" />
                            Feature Scaling Methods
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-blue-700 mb-2">Normalization</h3>
                                <p className="text-blue-600">Scales features to a fixed range [0,1]. Best used when:</p>
                                <ul className="list-disc list-inside mt-2 text-blue-600 space-y-1">
                                    <li>Data doesn't follow a normal distribution</li>
                                    <li>Need bounded values between 0 and 1</li>
                                    <li>Working with neural networks or algorithms requiring bounded inputs</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-green-700 mb-2">Standardization</h3>
                                <p className="text-green-600">Transforms data to mean=0, std=1. Best used when:</p>
                                <ul className="list-disc list-inside mt-2 text-green-600 space-y-1">
                                    <li>Data follows a normal distribution</li>
                                    <li>Working with algorithms sensitive to magnitudes</li>
                                    <li>Using algorithms like SVM, linear/logistic regression</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => handleNormalization('normalize')}
                                disabled={processing}
                                className={`
                                    w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium
                                    flex items-center justify-center space-x-2
                                    ${processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                                `}
                            >
                                <ArrowDownUp className="w-5 h-5" />
                                <span>Normalize Data</span>
                            </button>
                            <button
                                onClick={() => handleNormalization('standardize')}
                                disabled={processing}
                                className={`
                                    w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium
                                    flex items-center justify-center space-x-2
                                    ${processing ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
                                `}
                            >
                                <ArrowDownUp className="w-5 h-5" />
                                <span>Standardize Data</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                            <Check className="w-5 h-5 mr-2" />
                            {result.message}
                        </div>

                        <div className="border rounded-lg shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-bold">Scaled Features</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {result.scaled_columns.map((column) => (
                                        <div key={column} className="p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">
                                                {column.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-lg shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-bold">Preview of Scaled Data</h2>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {Object.keys(result.preview[0]).map((header) => (
                                                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        {header.replace(/_/g, ' ')}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {result.preview.map((row, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    {Object.values(row).map((value, colIndex) => (
                                                        <td key={colIndex} className="px-4 py-3 text-sm text-gray-500">
                                                            {typeof value === 'number' ? value.toFixed(3) : value}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NormalizeComponent;
