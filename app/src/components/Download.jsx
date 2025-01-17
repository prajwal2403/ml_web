import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

const DownloadSection = ({ onDownloadComplete }) => {
    const [downloadStatus, setDownloadStatus] = useState('idle');

    useEffect(() => {
        if (downloadStatus === 'idle') {
            handleDownload();
        }
    }, []); // Trigger download on mount

    const handleDownload = async () => {
        setDownloadStatus('loading');

        try {
            const response = await fetch('/download/');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Download failed');
            }

            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
                : 'processed_data.csv';

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setDownloadStatus('success');
            setTimeout(() => {
                setDownloadStatus('idle');
                onDownloadComplete?.('cleaning');
            }, 3000);
        } catch (error) {
            console.error('Download error:', error);
            setDownloadStatus('error');
            setTimeout(() => {
                setDownloadStatus('idle');
                onDownloadComplete?.('cleaning');
            }, 3000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Download Processed Data
                </h2>
                <p className="text-gray-600">
                    {downloadStatus === 'loading'
                        ? 'Your download is in progress...'
                        : 'Your processed dataset will begin downloading automatically.'}
                </p>
            </div>

            {downloadStatus === 'success' && (
                <div className="mt-4 p-4 rounded-lg border bg-green-50 border-green-200">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <div>
                            <h3 className="font-medium text-green-800">Success!</h3>
                            <p className="text-green-700 mt-1">
                                Your file has been downloaded successfully. Returning to previous section...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {downloadStatus === 'error' && (
                <div className="mt-4 p-4 rounded-lg border bg-red-50 border-red-200">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <div>
                            <h3 className="font-medium text-red-800">Download Failed</h3>
                            <p className="text-red-700 mt-1">
                                There was an error downloading your file. Please ensure data has been cleaned before downloading. Returning to previous section...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DownloadSection;