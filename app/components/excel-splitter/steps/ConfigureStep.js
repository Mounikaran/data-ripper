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
  formatFileSize,
  fileType,
  onFileTypeChange,
  headerRows,
  onHeaderRowsChange
}) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2 text-center text-gray-800">Configure</h2>
      <p className="text-gray-700 mb-6 text-center">
        Set options for processing your file
      </p>
      
      {/* File info */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-700 font-medium truncate">{fileName}</p>
        <p className="text-xs text-gray-600">Size: {formatFileSize(fileSize)}</p>
      </div>
      
      <form onSubmit={onSubmit} className="max-w-sm mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="file-type">
            File Type:
          </label>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              type="button"
              onClick={() => onFileTypeChange('source')}
              className={`p-2 text-sm rounded transition-colors ${
                fileType === 'source' 
                  ? 'bg-blue-100 border border-blue-400 text-blue-800' 
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Source File
              <span className="block text-xs mt-1 text-gray-500">(1 header row)</span>
            </button>
            
            <button
              type="button"
              onClick={() => onFileTypeChange('template')}
              className={`p-2 text-sm rounded transition-colors ${
                fileType === 'template' 
                  ? 'bg-blue-100 border border-blue-400 text-blue-800' 
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Response Template
              <span className="block text-xs mt-1 text-gray-500">(2 header rows)</span>
            </button>
            
            <button
              type="button"
              onClick={() => onFileTypeChange('custom')}
              className={`p-2 text-sm rounded transition-colors ${
                fileType === 'custom' 
                  ? 'bg-blue-100 border border-blue-400 text-blue-800' 
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Custom
              <span className="block text-xs mt-1 text-gray-500">(Set headers)</span>
            </button>
          </div>
          
          {fileType === 'custom' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="header-rows">
                Header Rows:
              </label>
              <input
                id="header-rows"
                type="number"
                min="1"
                max="10"
                value={headerRows}
                onChange={(e) => onHeaderRowsChange(parseInt(e.target.value, 10))}
                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm text-gray-700"
              />
              <p className="mt-1 text-xs text-gray-600">
                Number of rows to preserve as headers in each file
              </p>
            </div>
          )}
          
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="rows-per-file">
            Rows Per File:
          </label>
          
          <input
            id="rows-per-file"
            type="text"
            value={rowsPerFile}
            onChange={onRowsChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm text-gray-700 ${
              rowsPerFile <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />
          
          {rowsPerFile <= 0 ? (
            <p className="mt-2 text-xs text-red-500 font-medium">
              Please enter a value greater than 0
            </p>
          ) : estimatedParts > 0 ? (
            <p className="mt-2 text-xs text-gray-700">
              Will create approximately {estimatedParts} file{estimatedParts !== 1 ? 's' : ''}
            </p>
          ) : null}
          
          <p className="mt-1 text-xs text-gray-600">
            {fileType === 'source' ? 'The first row' : fileType === 'template' ? 'The first two rows' : `The first ${headerRows} row${headerRows !== 1 ? 's' : ''}`} will be preserved in each file
          </p>
        </div>
        
        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2 px-4 border border-gray-200 rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={rowsPerFile <= 0}
            className={`flex-1 py-2 px-4 rounded text-white transition-colors text-sm ${
              rowsPerFile <= 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Process File
          </button>
        </div>
      </form>
    </div>
  );
}
