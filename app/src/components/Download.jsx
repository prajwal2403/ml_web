import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DownloadSection = ({ downloadType }) => {
    const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, loading, success, error

    const handleDownload = async () => {
        setDownloadStatus('loading');

        try {
            const response = await fetch(`http://localhost:8000/download/${downloadType}`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

            // Get filename from header or use default
            const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] ||
                `${downloadType}-data.csv`;

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
            // Reset status after 3 seconds
            setTimeout(() => setDownloadStatus('idle'), 3000);
        } catch (error) {
            console.error('Download error:', error);
            setDownloadStatus('error');
            // Reset status after 3 seconds
            setTimeout(() => setDownloadStatus('idle'), 3000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Download {downloadType === 'featured' ? 'Featured' : 'Cleaned'} Data
                </h2>
                <p className="text-gray-600">
                    Click the button below to download your {downloadType === 'featured' ? 'featured' : 'cleaned'} dataset.
                </p>
            </div>

            <button
                onClick={handleDownload}
                disabled={downloadStatus === 'loading'}
                className={`
          w-full sm:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center
          ${downloadStatus === 'loading'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }
          text-white transition-colors duration-200
        `}
            >
                <Download className="w-5 h-5 mr-2" />
                {downloadStatus === 'loading' ? 'Downloading...' : 'Download Data'}
            </button>

            {downloadStatus === 'success' && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        Your file has been downloaded successfully.
                    </AlertDescription>
                </Alert>
            )}

            {downloadStatus === 'error' && (
                <Alert className="mt-4 bg-red-50 border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <AlertTitle>Download Failed</AlertTitle>
                    <AlertDescription>
                        There was an error downloading your file. Please try again.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default DownloadSection;