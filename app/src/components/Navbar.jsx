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

    const navItems = [
        { id: 'upload', label: 'Upload', icon: Upload },
        { id: 'preview', label: 'Data Preview', icon: Table },
        { id: 'cleaning', label: 'Data Cleaning', icon: DatabaseBackup },
        { id: 'normalize', label: 'Data Normalizing', icon: LineChart },
        { id: 'model', label: 'Recommend Model', icon: Brain },
        { id: 'predict', label: 'Predict', icon: BarChart2 },
        { id: 'visualize', label: 'Visualization', icon: LineChart },
        {
            id: 'download',
            label: 'Download Data',
            icon: Download
        }
    ];

    const handleNavClick = (id) => {
        setCurrentSection(id);
        setIsMobileMenuOpen(false);
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
                                disabled={id === 'download' && isDownloading}
                                className={`
                                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                                    ${currentSection === id
                                        ? 'bg-blue-500 text-white'
                                        : id === 'download'
                                            ? isDownloading
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    } 
                                    transition-colors duration-200
                                `}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {isDownloading && id === 'download' ? 'Downloading...' : label}
                            </button>
                        ))}
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
                                disabled={id === 'download' && isDownloading}
                                className={`
                                    flex items-center w-full px-3 py-2 rounded-md text-sm font-medium
                                    ${currentSection === id
                                        ? 'bg-blue-500 text-white'
                                        : id === 'download'
                                            ? isDownloading
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }
                                    transition-colors duration-200
                                `}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {isDownloading && id === 'download' ? 'Downloading...' : label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;