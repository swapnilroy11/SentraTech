import React from 'react';

const SentraTechLogo = ({ 
  width = 48, 
  height = 48, 
  className = "", 
  showText = true,
  variant = "default" // default, white-bg, dark-bg, minimal
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Black & White Geometric Star */}
      <div className="relative" style={{ width: width, height: height }}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Subtle glow for depth */}
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background Square - Black */}
          <rect 
            width="48" 
            height="48" 
            rx="6" 
            fill="#000000" 
            stroke="#333333" 
            strokeWidth="0.5"
          />
          
          {/* SentraTech Inspired Geometric Star - White */}
          <g transform="translate(6, 6)" filter="url(#subtleGlow)">
            {/* Eight-pointed star pattern - simplified and clean */}
            
            {/* Top triangle */}
            <polygon points="18,2 14,12 22,12" fill="#FFFFFF" />
            
            {/* Top-right triangle */}
            <polygon points="22,12 34,2 30,12" fill="#FFFFFF" />
            
            {/* Right triangle */}
            <polygon points="30,12 34,18 22,22" fill="#FFFFFF" />
            
            {/* Bottom-right triangle */}
            <polygon points="22,22 34,34 22,30" fill="#FFFFFF" />
            
            {/* Bottom triangle */}
            <polygon points="22,30 14,30 18,34" fill="#FFFFFF" />
            
            {/* Bottom-left triangle */}
            <polygon points="14,30 2,34 6,22" fill="#FFFFFF" />
            
            {/* Left triangle */}
            <polygon points="6,22 2,18 14,12" fill="#FFFFFF" />
            
            {/* Top-left triangle */}
            <polygon points="14,12 2,2 6,12" fill="#FFFFFF" />
            
            {/* Central star core */}
            <polygon points="18,12 22,18 18,24 14,18" fill="#FFFFFF" />
            
            {/* Inner diamond accent */}
            <polygon points="18,14 20,18 18,22 16,18" fill="#000000" />
          </g>
        </svg>
      </div>
      
      {/* Logo Text - SENTRA (Matrix Green) + TECH (White) */}
      {showText && (
        <div className="flex items-baseline space-x-1">
          <span className="text-xl md:text-2xl font-bold font-rajdhani tracking-wide text-[#00FF41]">
            SENTRA
          </span>
          <span className="text-xl md:text-2xl font-bold font-rajdhani tracking-wide text-[#F8F9FA]">
            TECH
          </span>
        </div>
      )}
    </div>
  );
};

export default SentraTechLogo;