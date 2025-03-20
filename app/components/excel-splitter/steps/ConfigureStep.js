'use client';

export default function ConfigureStep({ 
  fileName, 
  fileSize, 
  rowsPerFile, 
  estimatedParts, 
  onRowsChange, 
  onSubmit, 
  onBack, 
  error,
  formatFileSize 
}) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Configure</h2>
      <p className="text-gray-600 mb-6 text-center">
        Set options for processing your file
      </p>
      
      {/* File info */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600 font-medium truncate">{fileName}</p>
        <p className="text-xs text-gray-500">Size: {formatFileSize(fileSize)}</p>
      </div>
      
      <form onSubmit={onSubmit} className="max-w-sm mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="rows-per-file">
            Rows Per File:
          </label>
          
          <input
            id="rows-per-file"
            type="number"
            min="100"
            value={rowsPerFile}
            onChange={onRowsChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          
          {estimatedParts > 0 && (
            <p className="mt-2 text-xs text-gray-600">
              Will create approximately {estimatedParts} file{estimatedParts !== 1 ? 's' : ''}
            </p>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            The first two rows will be preserved in each file
          </p>
        </div>
        
        {error && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm"
          >
            Process File
          </button>
        </div>
      </form>
    </div>
  );
}
