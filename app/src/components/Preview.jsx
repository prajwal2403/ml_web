import React, { useState, useEffect } from 'react';

const Preview = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://web-production-6c2a.up.railway.app/get-data-info/');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full border rounded shadow p-4">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                <span className="block sm:inline">Error loading data: {error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Dataset Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Total Rows</p>
                        <p className="text-2xl font-bold">{data?.total_rows}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Total Columns</p>
                        <p className="text-2xl font-bold">{data?.total_columns}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Missing Values</p>
                        <p className="text-2xl font-bold">
                            {Object.values(data?.missing_values || {}).reduce((a, b) => a + b, 0)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="border rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {data?.preview[0] &&
                                    Object.keys(data.preview[0]).map((header) => (
                                        <th
                                            key={header}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {header.replace(/_/g, ' ')}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.preview.map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {Object.values(row).map((value, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            {typeof value === 'number' ? value.toFixed(2) : value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Preview;
