'use client';

export default function CompleteStep({ resetForm }) {
  return (
    <div className="text-center p-4">
      {/* Success check */}
      <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">
        Processing Complete
      </h2>
      
      <div className="max-w-md mx-auto">
        <p className="text-gray-600 mb-6">
          Your Excel file has been split and downloaded as a ZIP archive
        </p>
        
        <button
          onClick={resetForm}
          className="w-full py-2 px-4 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          Process Another File
        </button>
      </div>
    </div>
  );
}
