import React from 'react';

const SentraTechLogo = ({ 
  width = 48, 
  height = 48, 
  className = "", 
  showText = true,
  textColor = "#00FF41",
  showTagline = false
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Exact Recreation */}
      <div className="relative" style={{ width: width, height: height }}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Square */}
          <rect width="48" height="48" rx="4" fill="#0A0A0A" stroke="#2a2a2a" strokeWidth="0.5" />
          
          {/* SentraTech Geometric Star - Exact Recreation */}
          <g transform="translate(8, 8)">
            {/* Create the exact star pattern with 8 triangular sections */}
            
            {/* Top triangle */}
            <polygon points="16,4 12,12 20,12" fill="#F8F9FA" />
            
            {/* Top-right triangle */}
<polygon points="20,12 28,4 28,12" fill="#F8F9FA" />
            
            {/* Right triangle */}
            <polygon points="28,12 20,12 28,20" fill="#F8F9FA" />
            
            {/* Bottom-right triangle */}
            <polygon points="28,20 28,28 20,20" fill="#F8F9FA" />
            
            {/* Bottom triangle */}
            <polygon points="20,20 20,28 12,20" fill="#F8F9FA" />
            
            {/* Bottom-left triangle */}
            <polygon points="12,20 4,28 4,20" fill="#F8F9FA" />
            
            {/* Left triangle */}
            <polygon points="4,20 12,20 4,12" fill="#F8F9FA" />
            
            {/* Top-left triangle */}
            <polygon points="4,12 4,4 12,12" fill="#F8F9FA" />
            
            {/* Center diamond/star core */}
            <polygon points="16,12 20,16 16,20 12,16" fill="#F8F9FA" />
          </g>
          
          {/* Subtle glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          {showTagline && (
            <span 
              className="text-sm font-medium font-rajdhani tracking-wide mb-1"
              style={{ color: textColor }}
            >
              Better, Beyond & Boundless
            </span>
          )}
          <span 
            className="text-xl md:text-2xl font-bold font-rajdhani tracking-wide"
            style={{ color: textColor }}
          >
            SENTRA TECH
          </span>
        </div>
      )}
    </div>
  );
};

export default SentraTechLogo;