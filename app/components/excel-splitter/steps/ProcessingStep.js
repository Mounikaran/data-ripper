'use client';

export default function ProcessingStep({ fileName, isLoading, error, onReset, progress, processedFiles, totalFiles, processingStatus, processingStep, zipProgress, fileMetadata }) {

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Processing {fileName || 'File'}</h2>
      <p className="text-gray-700 mb-4">
        {processingStatus || 'Splitting your Excel file into smaller chunks. This may take a moment...'}
      </p>
      
      <div className="flex flex-col items-center space-y-6">
        {/* File metadata if available */}
        {fileMetadata && (
          <div className="w-full max-w-md bg-blue-50 p-3 rounded-lg mb-4 text-left">
            <p className="font-medium text-blue-800 mb-2 text-sm">File Information:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-800">
              <p className="text-gray-800">Total rows: <span className="font-medium text-black">{fileMetadata.totalRows}</span></p>
              <p className="text-gray-800">Data rows: <span className="font-medium text-black">{fileMetadata.dataRows}</span></p>
              <p className="text-gray-800">Header rows: <span className="font-medium text-black">{fileMetadata.headerRows}</span></p>
              <p className="text-gray-800">Output files: <span className="font-medium text-black">{fileMetadata.estimatedFiles}</span></p>
            </div>
          </div>
        )}
        
        {/* Processing Step Indicators */}
        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between relative mb-1">
            <div className={`flex flex-col items-center z-10 ${processingStep === 'upload' || processingStep === 'parse' || processingStep === 'start' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${processingStep === 'upload' || processingStep === 'parse' || processingStep === 'start' ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-100 text-gray-400'}`}>1</div>
              <span className="text-xs">Reading</span>
            </div>
            <div className={`flex flex-col items-center z-10 ${processingStep === 'process' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${processingStep === 'process' ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-100 text-gray-400'}`}>2</div>
              <span className="text-xs">Processing</span>
            </div>
            <div className={`flex flex-col items-center z-10 ${processingStep === 'finalize' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${processingStep === 'finalize' ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' : 'bg-gray-100 text-gray-400'}`}>3</div>
              <span className="text-xs">Finalizing</span>
            </div>
            {/* Progress line connecting steps */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
          </div>
        </div>
        
        {/* Simple spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-700">{progress}%</span>
          </div>
          
          {totalFiles > 0 && (
            <div className="text-xs text-gray-600 mb-2 flex flex-col">
              <span className="mb-1">
                <span className="font-medium text-blue-600">{processedFiles}</span> of <span className="font-medium text-blue-600">{totalFiles}</span> files processed
              </span>
              {processedFiles < totalFiles && (
                <span className="text-gray-500">
                  Currently processing file {processedFiles + 1}...
                </span>
              )}
            </div>
          )}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* ZIP Progress Bar (only shown during ZIP creation) */}
          {processingStep === 'finalize' && zipProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Creating ZIP Archive</span>
                <span className="text-sm text-gray-700">{zipProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300" 
                  style={{ width: `${zipProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
