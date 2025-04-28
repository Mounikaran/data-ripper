import FileUpload from './components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8" style={{
      backgroundImage: `radial-gradient(circle at 25px 25px, rgba(74, 144, 226, 0.15) 2px, transparent 0), 
                         linear-gradient(to bottom right, #EBF4FF, #FFFFFF, #E6F0FF)`,
      backgroundSize: '30px 30px, 100% 100%'
    }}>
      {/* Simple Header */}
      <header className="max-w-6xl mx-auto mb-2">
        <div className="flex items-center justify-center">
          <div className="mr-3">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="#4a90e2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-3xl font-bold text-gray-800">
            Data Ripper
          </h4>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto">
        {/* File upload component */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100" style={{ boxShadow: '0 4px 20px rgba(74, 144, 226, 0.1)' }}>
          <FileUpload />
        </div>
      </main>

    </div>
  );
}
