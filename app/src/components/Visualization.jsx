import React, { useState } from 'react';
import { LineChart, RefreshCw, Database } from 'lucide-react';

const Visualization = () => {
    const [selectedViz, setSelectedViz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageData, setImageData] = useState(null);

    const visualizations = [
        {
            id: 'data-quality',
            title: 'Data Quality Analysis',
            icon: Database,
            description: 'Heatmap showing missing values in the dataset'
        },
        {
            id: 'correlation',
            title: 'Correlation Analysis',
            icon: LineChart,
            description: 'Heatmap showing correlations between features'
        },
        {
            id: 'model-performance',
            title: 'Model Performance',
            icon: RefreshCw,
            description: 'Bar chart comparing model accuracies'
        }
    ];

    const fetchVisualization = async (type) => {
        setLoading(true);
        setError(null);
        setSelectedViz(type);

        try {
            const response = await fetch(`http://localhost:8000/visualize/${type}/`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            setImageData(URL.createObjectURL(blob));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
                {visualizations.map(({ id, title, icon: Icon, description }) => (
                    <div
                        key={id}
                        className={`border rounded-lg shadow p-4 cursor-pointer transition-all ${selectedViz === id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => fetchVisualization(id)}
                    >
                        <h2 className="flex items-center text-lg font-semibold mb-2">
                            <Icon className="w-5 h-5 mr-2" />
                            {title}
                        </h2>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-500 text-red-700 p-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            {loading && (
                <div className="flex justify-center p-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            )}

            {imageData && !loading && (
                <div className="border rounded-lg shadow p-4">
                    <img
                        src={imageData}
                        alt={`${selectedViz} visualization`}
                        className="w-full h-auto"
                    />
                </div>
            )}
        </div>
    );
};

export default Visualization;
