'use client';

export default function HowItWorks() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-base font-medium mb-4">
        How It Works
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <span className="text-gray-600 text-sm">1</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Upload your Excel file (.xlsx)</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <span className="text-gray-600 text-sm">2</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Choose how many rows per split file</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <span className="text-gray-600 text-sm">3</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">First two rows are kept in each file</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <span className="text-gray-600 text-sm">4</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Download all files as a ZIP archive</p>
          </div>
        </div>
      </div>
    </div>
  );
}
