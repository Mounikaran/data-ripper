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
  const [rowsPerFile, setRowsPerFile] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Configure, 3: Processing, 4: Complete
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [estimatedParts, setEstimatedParts] = useState(0);
  const [progress, setProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  
  // More detailed processing state
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingStep, setProcessingStep] = useState('');
  const [zipProgress, setZipProgress] = useState(0);
  const [fileMetadata, setFileMetadata] = useState(null);
  
  // File type and header rows
  const [fileType, setFileType] = useState('template'); // 'source', 'template', or 'custom'
  const [headerRows, setHeaderRows] = useState(2); // Default to 2 header rows

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (
        selectedFile.name.endsWith('.xlsx') || 
        selectedFile.name.endsWith('.xls') || 
        selectedFile.name.endsWith('.csv')
      )) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize(selectedFile.size);
      setError('');
      setStep(2); // Move to configuration step
    } else {
      setFile(null);
      setError('Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file');
    }
  };

  const handleRowsChange = (e) => {
    const rows = e.target.value ? parseInt(e.target.value, 10) : 0;
    setRowsPerFile(rows);
    updateEstimatedParts(rows);
  };
  
  const handleFileTypeChange = (type) => {
    setFileType(type);
    
    // Set header rows based on file type
    let newHeaderRows = 2; // Default for template
    if (type === 'source') {
      newHeaderRows = 1;
    } else if (type === 'custom') {
      // Keep current value for custom
      newHeaderRows = headerRows;
    }
    
    setHeaderRows(newHeaderRows);
    updateEstimatedParts(rowsPerFile, newHeaderRows);
  };
  
  const handleHeaderRowsChange = (value) => {
    setHeaderRows(value);
    updateEstimatedParts(rowsPerFile, value);
  };
  
  const updateEstimatedParts = (rows, headers = headerRows) => {
    // Estimate number of parts (very rough estimate)
    if (file && rows > 0) {
      // Assuming average of 100 bytes per row as a rough estimate
      const estimatedTotalRows = Math.max(Math.floor(file.size / 100) - headers, 1);
      setEstimatedParts(Math.ceil(estimatedTotalRows / rows));
    } else {
      setEstimatedParts(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (rowsPerFile <= 0) {
      setError('Please specify a valid number of rows per file (greater than 0)');
      return;
    }
    
    if (fileType === 'custom' && (headerRows <= 0 || headerRows > 10)) {
      setError('Please specify a valid number of header rows (1-10)');
      return;
    }

    try {
      // Reset all state
      setIsLoading(true);
      setError('');
      setSuccess(false);
      setProgress(0);
      setProcessedFiles(0);
      setTotalFiles(0);
      setProcessingStatus('Starting...');
      setProcessingStep('');
      setZipProgress(0);
      setFileMetadata(null);
      setStep(3); // Move to processing step

      const formData = new FormData();
      formData.append('file', file);
      formData.append('rowsPerFile', rowsPerFile.toString());
      formData.append('headerRows', headerRows.toString());
      formData.append('fileType', fileType);

      // Set up streaming request
      const response = await fetch('/api/split-excel', {
        method: 'POST',
        body: formData,
      });
      
      if (response.headers.get('Content-Type')?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          // Decode the chunk and add it to our buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete events in the buffer
          const events = buffer.split('\n\n');
          buffer = events.pop() || ''; // Keep the last incomplete event in the buffer
          
          for (const event of events) {
            if (event.startsWith('data: ')) {
              try {
                const data = JSON.parse(event.slice(6));
                
                // Handle different event types
                switch (data.type) {
                  case 'status':
                    // Update processing status
                    setProcessingStatus(data.message || 'Processing...');
                    setProcessingStep(data.step || '');
                    break;
                    
                  case 'metadata':
                    // Store file metadata
                    setFileMetadata(data);
                    setTotalFiles(data.estimatedFiles || 0);
                    break;
                    
                  case 'progress':
                    // Update progress information
                    setProcessedFiles(data.currentFile || 0);
                    setTotalFiles(data.totalFiles || 0);
                    setProgress(data.percentage || 0);
                    break;
                    
                  case 'zip_progress':
                    // Update zip creation progress
                    setZipProgress(data.percentage || 0);
                    setProcessingStatus('Creating ZIP archive...');
                    break;
                    
                  case 'complete':
                    // Process is complete, download the file
                    if (data.zipData && data.zipData.length > 0) {
                      const zipArray = new Uint8Array(data.zipData);
                      const blob = new Blob([zipArray], { type: 'application/zip' });
                      
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
                      
                      // Clean up the URL object
                      window.URL.revokeObjectURL(url);
                    }

                    // Set success message
                    setSuccess(true);
                    setProgress(100);
                    setProcessingStatus('Complete');
                    setStep(4); // Move to complete step
                    break;
                    
                  case 'error':
                    throw new Error(data.message || 'Error processing file');
                }
              } catch (error) {
                console.error('Error parsing event:', error);
                setError(`Error parsing server response: ${error.message}`);
              }
            }
          }
        }
      } else {
        // Handle non-streaming response (fallback)
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
        
        // Clean up the URL object
        window.URL.revokeObjectURL(url);

        // Set success message
        setSuccess(true);
        setStep(4); // Move to complete step
      }
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
    setRowsPerFile(0);
    setEstimatedParts(0);
    setError('');
    setSuccess(false);
    setStep(1);
    setFileType('template');
    setHeaderRows(2);
    setProcessingStatus('');
    setProcessingStep('');
    setProgress(0);
    setZipProgress(0);
    setFileMetadata(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full p-6 rounded bg-white relative overflow-hidden" style={{ boxShadow: 'inset 0 0 0 1px rgba(74, 144, 226, 0.1)' }}>
      {/* Blue accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
      
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
          fileType={fileType}
          onFileTypeChange={handleFileTypeChange}
          headerRows={headerRows}
          onHeaderRowsChange={handleHeaderRowsChange}
        />
      )}

      {/* Step 3: Processing */}
      {step === 3 && (
        <ProcessingStep
          fileName={fileName}
          isLoading={isLoading}
          error={error}
          onReset={resetForm}
          progress={progress}
          processedFiles={processedFiles}
          totalFiles={totalFiles}
          processingStatus={processingStatus}
          processingStep={processingStep}
          zipProgress={zipProgress}
          fileMetadata={fileMetadata}
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
