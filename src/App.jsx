// flowchart-app/src/App.jsx
import React from 'react';
import Flowchart from './Flowchart';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Project Plan: Cartilage-Seated Guide Validation
        </h1>
        <p className="text-lg text-gray-600">
          Flowchart visualizing the Pilot and Main study phases.
        </p>
      </header>
      <main className="max-w-7xl mx-auto border border-gray-300 rounded-lg shadow-lg overflow-hidden">
         {/* Legend */}
         <div className="p-4 bg-white border-b border-gray-200 flex items-center space-x-6">
            <h2 className="text-lg font-semibold text-gray-700">Legend:</h2>
            <div className="flex items-center space-x-2">
                <span className="block w-5 h-5 bg-outcome-fill border-2 border-outcome-border rounded"></span>
                <span className="text-sm text-gray-600">Outcome Measurement Point</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="block w-5 h-5 bg-blue-600 border border-blue-800 rounded-full"></span>
                <span className="text-sm text-gray-600">Start / End</span>
            </div>
             <div className="flex items-center space-x-2">
                {/* Simulate diamond shape for legend */}
                <span className="block w-4 h-4 bg-orange-100 border border-orange-500 transform rotate-45"></span>
                <span className="text-sm text-gray-600">Decision</span>
            </div>
             <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">----</span>
                 <span className="text-sm text-gray-600">Phase Transition</span>
             </div>
        </div>
        <Flowchart />
      </main>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        Generated on: {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}

export default App;
