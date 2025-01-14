import React, { useState } from "react";
import Navbar from "./components/Navbar";
import UploadComponent from "./components/UploadComponent";
import Preview from "./components/Preview";
import Cleaning from "./components/Cleaning";
import Normalize from "./components/Normalize";
import Recomendation from "./components/Recomendation";
import Predict from "./components/Predict";
import Visualization from "./components/Visualization";

const App = () => {
  const [currentSection, setCurrentSection] = useState('upload');
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to handle dataset download
  const handleDatasetDownload = async () => {
    try {
      setIsDownloading(true);

      // First try to download cleaned data
      const response = await fetch('/download/cleaned');

      if (response.ok) {
        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
          : 'dataset.csv';

        // Create blob from response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to download dataset');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(error.message || 'Error downloading dataset. Please ensure data has been cleaned.');
    } finally {
      setIsDownloading(false);
      // Return to previous section after download attempt
      setCurrentSection('cleaning');
    }
  };

  // Function to handle featured dataset download
  const handleFeaturedDatasetDownload = async () => {
    try {
      setIsDownloading(true);

      const response = await fetch('/download/featured');

      if (response.ok) {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
          : 'featured_dataset.csv';

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to download featured dataset');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(error.message || 'Error downloading featured dataset. Please ensure feature engineering has been applied.');
    } finally {
      setIsDownloading(false);
      // Return to previous section after download attempt
      setCurrentSection('normalize');
    }
  };

  // Function to render the appropriate component based on currentSection
  const renderComponent = () => {
    switch (currentSection) {
      case 'upload':
        return <UploadComponent />;
      case 'preview':
        return <Preview />;
      case 'cleaning':
        return <Cleaning />;
      case 'normalize':
        return <Normalize />;
      case 'model':
        return <Recomendation />;
      case 'predict':
        return <Predict />;
      case 'visualize':
        return <Visualization />;
      case 'download-cleaned':
        handleDatasetDownload();
        return <Cleaning />;
      case 'download-featured':
        handleFeaturedDatasetDownload();
        return <Normalize />;
      default:
        return <UploadComponent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        isDownloading={isDownloading}
      />
      <main className="container mx-auto px-4 pt-6">
        {renderComponent()}
      </main>
    </div>
  );
};

export default App;