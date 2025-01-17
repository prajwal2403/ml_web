import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Recomendation = () => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedSection, setExpandedSection] = useState(null);

    const learningDescriptions = {
        "Classification (Supervised)": "Predicts categorical labels/classes for input data. Suitable for tasks like spam detection, disease diagnosis, or customer churn prediction.",
        "Regression (Supervised)": "Predicts continuous numerical values. Used for forecasting prices, estimating ages, or predicting quantities.",
        "Clustering (Unsupervised)": "Groups similar data points together without predefined labels. Useful for customer segmentation or pattern discovery.",
        "Natural Language Processing": "Analyzes and processes human language data. Applied in sentiment analysis, text classification, or language translation.",
        "Time Series Analysis": "Analyzes time-dependent data sequences. Used for stock price prediction, weather forecasting, or sales forecasting.",
        "Dimensionality Reduction": "Reduces the number of features while preserving important information. Helpful for visualization and handling high-dimensional data."
    };

    useEffect(() => {
        fetchRecommendation();
    }, []);

    const fetchRecommendation = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://web-production-6c2a.up.railway.app/recommend-learning/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setRecommendation(data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message === 'Failed to fetch'
                ? 'Unable to connect to the server. Please check if the backend is running.'
                : `Error: ${err.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 border border-gray-300 shadow-md rounded-lg mt-6">
                <div className="flex items-center justify-center">
                    <Brain className="w-6 h-6 animate-pulse text-blue-500" />
                    <span className="ml-2">Analyzing dataset...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 flex items-center bg-red-50 border border-red-300 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">
                    {error}
                    <button
                        onClick={fetchRecommendation}
                        className="ml-2 text-sm underline hover:no-underline"
                    >
                        Try again
                    </button>
                </span>
            </div>
        );
    }

    if (!recommendation) return null;

    return (
        <div className="container mx-auto p-4 border border-gray-300 shadow-md rounded-lg mt-6">
            <div className="p-4 border-b border-gray-300">
                <h2 className="flex items-center text-lg font-semibold">
                    <Brain className="w-6 h-6 mr-2 text-blue-500" />
                    Model Recommendation
                </h2>
            </div>
            <div className="p-4 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700">
                        {recommendation.recommended_learning}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        {learningDescriptions[recommendation.recommended_learning]}
                    </p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Confidence: {recommendation.confidence}
                    </div>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => toggleSection('analysis')}
                        className="w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <span className="font-medium">Dataset Analysis</span>
                        {expandedSection === 'analysis' ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                    {expandedSection === 'analysis' && (
                        <div className="p-4 bg-white border rounded-lg">
                            <dl className="grid grid-cols-2 gap-4">
                                {Object.entries(recommendation.analysis).map(([key, value]) => (
                                    <div key={key}>
                                        <dt className="text-sm font-medium text-gray-500">
                                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}
                </div>

                {recommendation.additional_notes.length > 0 && (
                    <div className="space-y-2">
                        <button
                            onClick={() => toggleSection('notes')}
                            className="w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <span className="font-medium">Additional Notes</span>
                            {expandedSection === 'notes' ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>
                        {expandedSection === 'notes' && (
                            <div className="p-4 bg-white border rounded-lg">
                                <ul className="space-y-2">
                                    {recommendation.additional_notes.map((note, index) => (
                                        <li key={index} className="text-sm text-gray-600">• {note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recomendation;
