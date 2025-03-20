'use client';

export default function ProcessingStep({ fileName, isLoading, error, onReset }) {
  // Simulated progress for visual feedback
  const progress = 75; // This would normally be a state variable

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-semibold mb-2">Processing {fileName || 'File'}</h2>
      <p className="text-gray-600 mb-6">
        Splitting your Excel file into smaller chunks. This may take a moment...
      </p>
      
      <div className="flex flex-col items-center space-y-6">
        {/* Simple spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Processing</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
