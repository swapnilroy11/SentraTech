import React from 'react';

const SentraTechLogo = ({ 
  width = 48, 
  height = 48, 
  className = "", 
  showText = true,
  textColor = "#00FF41"
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative" style={{ width: width, height: height }}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background */}
          <rect width="48" height="48" rx="8" fill="#F8F9FA" />
          
          {/* SentraTech Geometric Logo - Exact Recreation */}
          <g transform="translate(6, 6)">
            {/* Outer Octagons */}
            <polygon
              points="18,2 22,2 26,6 26,10 22,14 18,14 14,10 14,6"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="28,8 32,8 36,12 36,16 32,20 28,20 24,16 24,12"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="28,22 32,22 36,26 36,30 32,34 28,34 24,30 24,26"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="18,28 22,28 26,32 26,36 22,40 18,40 14,36 14,32"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="8,22 12,22 16,26 16,30 12,34 8,34 4,30 4,26"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="8,8 12,8 16,12 16,16 12,20 8,20 4,16 4,12"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            
            {/* Inner Triangles forming star pattern */}
            <polygon
              points="18,8 22,12 18,16 14,12"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="24,18 28,22 24,26 20,22"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="18,24 22,28 18,32 14,28"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            <polygon
              points="12,18 16,22 12,26 8,22"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="0.8"
            />
            
            {/* Center connection lines */}
            <line x1="18" y1="12" x2="18" y2="28" stroke="#2a2a2a" strokeWidth="0.8" />
            <line x1="12" y1="18" x2="28" y2="18" stroke="#2a2a2a" strokeWidth="0.8" />
            <line x1="14" y1="14" x2="22" y2="22" stroke="#2a2a2a" strokeWidth="0.8" />
            <line x1="22" y1="14" x2="14" y2="22" stroke="#2a2a2a" strokeWidth="0.8" />
            
            {/* Central accent point */}
            <circle cx="18" cy="18" r="2" fill={textColor} />
          </g>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className="text-xl md:text-2xl font-bold font-rajdhani tracking-wide"
            style={{ color: textColor }}
          >
            SENTRA
          </span>
          <span className="text-[#F8F9FA] text-sm md:text-lg font-semibold font-rajdhani -mt-1">
            TECH
          </span>
        </div>
      )}
    </div>
  );
};

export default SentraTechLogo;