import React, { useState, useEffect } from 'react';
import { BarChart2, ArrowRight, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Predict = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPrediction();
    }, []);

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/lazy-predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setPrediction(data);
        } catch (err) {
            setError('Failed to fetch prediction results');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4">Loading predictions...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!prediction) return null;

    const featureImportanceData = Object.entries(prediction.feature_importance)
        .map(([name, value]) => ({
            name: name.replace('_', ' '),
            value: (value * 100).toFixed(2)
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            <div className="border rounded-lg shadow p-4">
                <h2 className="flex items-center text-lg font-semibold mb-4">
                    <BarChart2 className="w-6 h-6 mr-2" />
                    Best Model Performance
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-700">
                            {prediction.model_results.best_model.name}
                        </h3>
                        <p className="text-2xl font-bold text-green-800 mt-2">
                            {(prediction.model_results.best_model.score * 100).toFixed(2)}% Accuracy
                        </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-700">Problem Type</h3>
                        <p className="text-2xl font-bold text-blue-800 mt-2">
                            {prediction.problem_type}
                        </p>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Top Models Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left">Model</th>
                                <th className="px-4 py-2 text-left">Accuracy</th>
                                <th className="px-4 py-2 text-left">F1 Score</th>
                                <th className="px-4 py-2 text-left">Time Taken</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prediction.model_results.top_models.map((model, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">{model.Model}</td>
                                    <td className="px-4 py-2">{(model.Accuracy * 100).toFixed(2)}%</td>
                                    <td className="px-4 py-2">{(model['F1 Score'] * 100).toFixed(2)}%</td>
                                    <td className="px-4 py-2 flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {model['Time Taken'].toFixed(3)}s
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="border rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Feature Importance</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featureImportanceData}>
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                            <YAxis label={{ value: 'Importance (%)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Predict;
