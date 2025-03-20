'use client';

export default function UploadStep({ handleFileChange, error }) {
  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-semibold mb-2">Upload Excel File</h2>
      <p className="text-gray-600 mb-6">
        Select an Excel file (.xlsx) to process
      </p>
      
      <div className="flex flex-col items-center">
        <button
          onClick={() => document.getElementById('file-upload').click()}
          className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Select File
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          or drag & drop file here
        </p>
        
        <div 
          className="mt-2 w-full max-w-sm border border-gray-200 rounded p-6 text-center"
          onClick={() => document.getElementById('file-upload').click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const files = e.dataTransfer.files;
            if (files.length) {
              const fileInput = document.getElementById('file-upload');
              fileInput.files = files;
              const event = new Event('change', { bubbles: true });
              fileInput.dispatchEvent(event);
            }
          }}
        >
          <svg className="h-6 w-6 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-1 text-xs text-gray-400">Excel (.xlsx) files only</p>
        </div>
      </div>
      
      <input
        id="file-upload"
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}