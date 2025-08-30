import React from 'react';
import 'animate.css';

function HomePage() {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat animate__animated animate__slideInRight"
      style={{
        backgroundImage: 'url(/bg.png)'
      }}
    >
    </div>
  );
}

export default HomePage;