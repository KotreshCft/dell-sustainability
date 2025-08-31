import React from 'react';
import 'animate.css';

function HomePage() {
  return (
    <div className="min-h-screen w-full relative animate__animated animate__slideInRight bg-[#044f52] ">
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default HomePage;