'use client';

import { useState } from 'react';
import UploadStep from './excel-splitter/steps/UploadStep';
import ConfigureStep from './excel-splitter/steps/ConfigureStep';
import ProcessingStep from './excel-splitter/steps/ProcessingStep';
import CompleteStep from './excel-splitter/steps/CompleteStep';
import ProgressSteps from './excel-splitter/common/ProgressSteps';
import ErrorMessage from './excel-splitter/common/ErrorMessage';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [rowsPerFile, setRowsPerFile] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Configure, 3: Processing, 4: Complete
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [estimatedParts, setEstimatedParts] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize(selectedFile.size);
      setError('');
      setStep(2); // Move to configuration step
    } else {
      setFile(null);
      setError('Please select a valid Excel (.xlsx) file');
    }
  };

  const handleRowsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const rows = value > 0 ? value : 1000;
    setRowsPerFile(rows);

    // Estimate number of parts (very rough estimate)
    if (file) {
      // Assuming average of 100 bytes per row as a rough estimate
      const estimatedTotalRows = Math.max(Math.floor(file.size / 100) - 2, 1);
      setEstimatedParts(Math.ceil(estimatedTotalRows / rows));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess(false);
      setStep(3); // Move to processing step

      const formData = new FormData();
      formData.append('file', file);
      formData.append('rowsPerFile', rowsPerFile.toString());

      const response = await fetch('/api/split-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.split('.')[0]}_split.zip`;

      // Append the link to the body
      document.body.appendChild(link);

      // Click the link to download the file
      link.click();

      // Remove the link from the body
      document.body.removeChild(link);

      // Set success message
      setSuccess(true);
      setStep(4); // Move to complete step
    } catch (err) {
      setError(err.message);
      setStep(2); // Go back to configuration step on error
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setFileSize(0);
    setRowsPerFile(10000);
    setEstimatedParts(0);
    setError('');
    setSuccess(false);
    setStep(1);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full p-6 rounded">
      <ProgressSteps currentStep={step} />

      {/* Step 1: Upload */}
      {step === 1 && (
        <UploadStep
          onFileSelect={handleFileChange}
          error={error}
        />
      )}

      {/* Step 2: Configure */}
      {step === 2 && (
        <ConfigureStep
          fileName={fileName}
          fileSize={fileSize}
          rowsPerFile={rowsPerFile}
          estimatedParts={estimatedParts}
          onRowsChange={handleRowsChange}
          onSubmit={handleSubmit}
          onBack={resetForm}
          error={error}
          formatFileSize={formatFileSize}
        />
      )}

      {/* Step 3: Processing */}
      {step === 3 && (
        <ProcessingStep
          fileName={fileName}
          isLoading={isLoading}
          error={error}
          onReset={resetForm}
        />
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <CompleteStep
          resetForm={resetForm}
        />
      )}

    </div>
  );
}
