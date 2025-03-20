import FileUpload from './components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Premium Header with 3D effect */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-center">
          <div className="mr-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Xebo Response Upload Helper
          </h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-6xl mx-auto">
        {/* File upload component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <FileUpload />
        </div>
      </main>
      
    </div>
  );
}
