'use client';

export default function ProgressSteps({ currentStep }) {
  const steps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Configure' },
    { number: 3, label: 'Process' },
    { number: 4, label: 'Complete' }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative">
            {/* Step connector line */}
            {index < steps.length - 1 && (
              <div 
                className="absolute left-1/2 right-0 h-[2px] top-[14px] -translate-x-1/2" 
                style={{ width: 'calc(100% - 2rem)' }}
              >
                <div className="h-full bg-gray-200"></div>
                {currentStep > step.number && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300" 
                    style={{ width: '100%' }}
                  ></div>
                )}
              </div>
            )}
            
            {/* Step circle */}
            <div 
              className={`w-7 h-7 flex items-center justify-center rounded-full z-10 text-xs font-medium transition-colors duration-300 ${
                currentStep > step.number 
                  ? 'bg-blue-500 text-white' 
                  : currentStep === step.number 
                    ? 'bg-white border-2 border-blue-500 text-blue-600' 
                    : 'bg-white border border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > step.number ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            
            {/* Step label */}
            <div className={`mt-2 text-xs font-medium transition-colors duration-300 ${
              currentStep >= step.number ? 'text-gray-700' : 'text-gray-500'
            }`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
