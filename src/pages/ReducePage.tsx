import React, { useState, useEffect } from 'react';
import ReduceCalc from './ReduceCalc';
import 'animate.css';


function ReducePage() {
  const [showInfo, setShowInfo] = useState(true);
  const [showCalculation, setShowCalculation] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Show info image for 10 seconds, then stay on calculation page permanently
    const infoTimer = setTimeout(() => {
      setShowInfo(false);
      setShowCalculation(true);
      // No further timer - stays on calculation page
    }, 10000); // 10 seconds for testing

    return () => {
      clearTimeout(infoTimer);
    };
  }, []);

  return (
    <>
      {showInfo && (
        <div className="fixed inset-0 w-full h-full animate__animated animate__slideInRight bg-[#044f52]">
          {!imageError ? (
            <video 
              src="/reduceinfo.mp4" 
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
            <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Reduce Information
                </h1>
                <p className="text-xl text-white">Displaying reduce information...</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {showCalculation && <ReduceCalc />}
    </>
  );
}

export default ReducePage;