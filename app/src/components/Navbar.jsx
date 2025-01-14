import React, { useState } from 'react';
import {
    Upload,
    Table,
    DatabaseBackup,
    LineChart,
    Brain,
    BarChart2,
    Menu,
    X,
    Download
} from 'lucide-react';

const Navbar = ({ currentSection, setCurrentSection, isDownloading }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);

    const navItems = [
        { id: 'upload', label: 'Upload', icon: Upload },
        { id: 'preview', label: 'Data Preview', icon: Table },
        { id: 'cleaning', label: 'Data Cleaning', icon: DatabaseBackup },
        { id: 'normalize', label: 'Data Normalizing', icon: LineChart },
        { id: 'model', label: 'Recommend Model', icon: Brain },
        { id: 'predict', label: 'Predict', icon: BarChart2 },
        { id: 'visualize', label: 'Visualization', icon: LineChart }
    ];

    const handleNavClick = (id) => {
        setCurrentSection(id);
        setIsMobileMenuOpen(false);
        setShowDownloadOptions(false);
    };

    const handleDownloadClick = () => {
        setShowDownloadOptions(!showDownloadOptions);
    };

    return (
        <nav className="bg-white shadow-md relative">
            {/* Desktop Navigation */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-xl font-bold text-gray-800">
                            DataScienceApp
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => handleNavClick(id)}
                                className={`
                                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                                    ${currentSection === id
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    } 
                                    transition-colors duration-200
                                `}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {label}
                            </button>
                        ))}

                        {/* Download dropdown */}
                        <div className="relative">
                            <button
                                onClick={handleDownloadClick}
                                disabled={isDownloading}
                                className={`
                                    flex items-center px-4 py-2 rounded-md text-sm font-medium ml-4
                                    ${isDownloading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600'
                                    }
                                    text-white transition-colors duration-200 shadow-sm
                                `}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloading ? 'Downloading...' : 'Download'}
                            </button>

                            {showDownloadOptions && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1" role="menu">
                                        <button
                                            onClick={() => {
                                                handleNavClick('download-cleaned');
                                                setShowDownloadOptions(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Download Cleaned Data
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleNavClick('download-featured');
                                                setShowDownloadOptions(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Download Featured Data
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isMobileMenuOpen
                                ? <X className="w-6 h-6" />
                                : <Menu className="w-6 h-6" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => handleNavClick(id)}
                                className={`
                                    flex items-center w-full px-3 py-2 rounded-md text-sm font-medium
                                    ${currentSection === id
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }
                                    transition-colors duration-200
                                `}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {label}
                            </button>
                        ))}

                        {/* Mobile Download buttons */}
                        <div className="mt-4 space-y-2">
                            <button
                                onClick={() => handleNavClick('download-cleaned')}
                                disabled={isDownloading}
                                className={`
                                    flex items-center w-full px-3 py-2 rounded-md text-sm font-medium
                                    ${isDownloading
                                        ? 'bg-gray-400'
                                        : 'bg-green-500 hover:bg-green-600'
                                    }
                                    text-white transition-colors duration-200
                                `}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Cleaned Data
                            </button>
                            <button
                                onClick={() => handleNavClick('download-featured')}
                                disabled={isDownloading}
                                className={`
                                    flex items-center w-full px-3 py-2 rounded-md text-sm font-medium
                                    ${isDownloading
                                        ? 'bg-gray-400'
                                        : 'bg-green-500 hover:bg-green-600'
                                    }
                                    text-white transition-colors duration-200
                                `}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Featured Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;