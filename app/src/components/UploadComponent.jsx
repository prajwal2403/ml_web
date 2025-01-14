import React, { useState } from 'react';
import { Upload, X, FileText, Check, AlertCircle, Table } from 'lucide-react';

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
    const [fileStats, setFileStats] = useState(null);

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            setUploadStatus({ type: '', message: '' });
            setFileStats(null);
        } else {
            setUploadStatus({
                type: 'error',
                message: 'Please upload a valid CSV file'
            });
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        setUploadStatus({ type: '', message: '' });
        setFileStats(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setUploadStatus({
                type: 'success',
                message: data.message
            });
            setFileStats({
                rows: data.rows,
                columns: data.columns
            });
        } catch (error) {
            setUploadStatus({
                type: 'error',
                message: 'Failed to upload file. Please try again.'
            });
            setFileStats(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Upload Dataset</h2>

            {uploadStatus.message && (
                <div className={`mb-4 p-4 rounded ${uploadStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    <div className="flex items-center">
                        {uploadStatus.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 mr-2" />
                        ) : (
                            <Check className="w-5 h-5 mr-2" />
                        )}
                        <span>{uploadStatus.message}</span>
                    </div>
                </div>
            )}

            <div className="border rounded-lg p-6 bg-white shadow-md">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center
                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                        ${file ? 'bg-gray-50' : 'hover:border-gray-400'}
                        transition-colors duration-200
                    `}
                >
                    {!file ? (
                        <div className="space-y-4">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div>
                                <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:text-blue-600">
                                    Click to upload
                                </label>
                                <span className="text-gray-500"> or drag and drop</span>
                            </div>
                            <p className="text-sm text-gray-500">CSV files only</p>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-4">
                                <FileText className="w-8 h-8 text-blue-500" />
                                <span className="text-gray-700">{file.name}</span>
                                <button
                                    onClick={removeFile}
                                    className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {file && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`
                                px-4 py-2 rounded text-white
                                ${uploading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}
                            `}
                        >
                            {uploading ? (
                                <span className="flex items-center">
                                    <Upload className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Uploading...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload File
                                </span>
                            )}
                        </button>
                    </div>
                )}

                {fileStats && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Table className="w-5 h-5 mr-2 text-blue-500" />
                            File Statistics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-lg shadow">
                                <div className="text-sm text-gray-500">Total Rows</div>
                                <div className="text-2xl font-bold text-blue-600">{fileStats.rows.toLocaleString()}</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow">
                                <div className="text-sm text-gray-500">Total Columns</div>
                                <div className="text-2xl font-bold text-blue-600">{fileStats.columns.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadComponent;