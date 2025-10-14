import React, { useMemo } from 'react';

const SpaceBackground = ({ intensity = 0.3, particles = 50 }) => {
  // Ultra-lightweight CSS-only particle system for better performance
  const particleElements = useMemo(() => {
    const elements = [];
    const particleCount = Math.min(particles, 50); // Much fewer particles for performance
    
    for (let i = 0; i < particleCount; i++) {
      elements.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        animationDelay: Math.random() * 10,
        animationDuration: Math.random() * 20 + 15
      });
    }
    return elements;
  }, [particles]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        opacity: intensity,
        background: 'radial-gradient(ellipse at center, rgba(0,20,0,0.1) 0%, rgba(0,0,0,1) 70%)'
      }}
      aria-hidden="true"
    >
      {/* Lightweight CSS particles */}
      {particleElements.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-green-400"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.animationDuration}s infinite linear`,
            animationDelay: `${particle.animationDelay}s`,
            willChange: 'transform' // Performance hint
          }}
        />
      ))}
      
      {/* CSS keyframes for smooth floating animation - moved to CSS file */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0px);
          }
          100% {
            transform: translateY(-10px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default SpaceBackground;