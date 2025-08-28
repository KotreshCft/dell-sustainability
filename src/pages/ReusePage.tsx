import React, { useState, useEffect } from 'react';
import ReuseCalc from './ReuseCalc';

function ReusePage() {
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
        <div className="fixed inset-0 w-full h-full bg-black">
          {!imageError ? (
            <img 
              src="/reuseinfo.png" 
              alt="Reuse Information" 
              className="w-full h-full object-cover"
              onError={() => {
                console.error('Image not found, showing placeholder');
                setImageError(true);
              }}
            />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Reuse Information
                </h1>
                <p className="text-xl text-white">Displaying reuse information...</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {showCalculation && <ReuseCalc />}
    </>
  );
}

export default ReusePage;