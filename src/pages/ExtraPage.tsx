import React, { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';

function ExtraPage() {
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
  const testimonials = [
    {
      name: 'Jennifer Williams',
      company: 'TechStart Inc.',
      text: 'Absolutely outstanding work! The team delivered beyond our expectations.',
      rating: 5
    },
    {
      name: 'David Brown',
      company: 'Creative Studios',
      text: 'Professional, creative, and reliable. Highly recommend their services.',
      rating: 5
    },
    {
      name: 'Lisa Garcia',
      company: 'Digital Ventures',
      text: 'Their attention to detail and innovation transformed our project.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900 flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto w-full">
        {showInfo && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {!imageError ? (
              <img 
                src="/extrainfo.png" 
                alt="Extra Information" 
                className="max-w-full max-h-[80vh] h-auto rounded-lg shadow-2xl object-contain"
                onError={() => {
                  console.error('Image not found, showing placeholder');
                  setImageError(true);
                }}
              />
            ) : (
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Extra Information
                </h1>
                <p className="text-xl text-white">Displaying extra information...</p>
              </div>
            )}
          </div>
        )}
        
        {showCalculation && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 animate-pulse">
                Extra
              </h1>
              <div className="h-2 w-32 bg-gradient-to-r from-amber-400 to-rose-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Additional features and bonus content
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Quote Icon */}
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Testimonial Text */}
                    <p className="text-white/90 text-lg leading-relaxed mb-8 flex-grow">
                      "{testimonial.text}"
                    </p>
                    
                    {/* Author */}
                    <div className="border-t border-white/20 pt-6">
                      <h4 className="text-white font-bold text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-amber-300 font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 border border-white/20">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white font-medium">4.9/5 Average Rating</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtraPage;