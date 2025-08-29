import React, { useState, useEffect } from 'react';
import RegenerateCalc from './RegenerateCalc';

function RegeneratePage() {
  const [showInfo, setShowInfo] = useState(true);
  const [showCalculation, setShowCalculation] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Show info image for 10 seconds
    const infoTimer = setTimeout(() => {
      setShowInfo(false);
      setShowCalculation(true);
    }, 10000);

    return () => {
      clearTimeout(infoTimer);
    };
  }, []);


  return (
    <>
      {showInfo && (
        <div className="fixed inset-0 w-full h-full">
          {!imageError ? (
            <video 
              src="/regeninfo.mp4" 
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              onError={() => {
                console.error('Video not found, showing placeholder');
                setImageError(true);
              }}
            />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Regenerate Information
                </h1>
                <p className="text-xl text-white">Displaying regenerate information...</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {showCalculation && <RegenerateCalc />}
    </>
  );
}

export default RegeneratePage;