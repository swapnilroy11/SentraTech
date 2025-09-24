import React from 'react';

const SentraTechLogo = ({ 
  width = 48, 
  height = 48, 
  className = "", 
  showText = true,
  textColor = "#00FF41",
  showTagline = false,
  variant = "default" // default, white, dark, minimal
}) => {
  const getLogoColors = () => {
    switch(variant) {
      case 'white':
        return { bg: '#F8F9FA', star: '#0A0A0A', accent: textColor };
      case 'dark':
        return { bg: '#0A0A0A', star: '#F8F9FA', accent: textColor };
      case 'minimal':
        return { bg: 'transparent', star: textColor, accent: textColor };
      default:
        return { bg: '#0A0A0A', star: '#F8F9FA', accent: textColor };
    }
  };

  const colors = getLogoColors();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Inspired by SentraTech Design */}
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
            {/* Gradient for shine effect */}
            <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: colors.star, stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#ffffff', stopOpacity: 0.8}} />
              <stop offset="100%" style={{stopColor: colors.star, stopOpacity: 1}} />
            </linearGradient>
            
            {/* Glow effect */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Shadow effect */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Background Square */}
          <rect 
            width="48" 
            height="48" 
            rx="8" 
            fill={colors.bg} 
            stroke={variant === 'minimal' ? 'none' : '#2a2a2a'} 
            strokeWidth="0.5"
            filter={variant !== 'minimal' ? "url(#shadow)" : ""}
          />
          
          {/* SentraTech Inspired Geometric Star */}
          <g transform="translate(6, 6)" filter="url(#glow)">
            {/* Eight-pointed star pattern inspired by your design */}
            
            {/* North point */}
            <polygon 
              points="18,2 14,10 22,10" 
              fill="url(#shine)" 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* Northeast point */}
            <polygon 
              points="22,10 30,2 26,10" 
              fill={colors.star} 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* East point */}
            <polygon 
              points="26,10 34,18 26,14" 
              fill="url(#shine)" 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* Southeast point */}
            <polygon 
              points="26,14 34,18 30,26" 
              fill={colors.star} 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* South point */}
            <polygon 
              points="22,26 18,34 14,26" 
              fill="url(#shine)" 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* Southwest point */}
            <polygon 
              points="14,26 6,34 10,26" 
              fill={colors.star} 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* West point */}
            <polygon 
              points="10,26 2,18 10,22" 
              fill="url(#shine)" 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* Northwest point */}
            <polygon 
              points="10,22 2,18 6,10" 
              fill={colors.star} 
              stroke={colors.accent} 
              strokeWidth="0.3"
            />
            
            {/* Central diamond core */}
            <polygon 
              points="18,10 22,14 18,22 14,14" 
              fill={colors.accent} 
              stroke={colors.star} 
              strokeWidth="0.5"
            />
            
            {/* Inner connecting lines */}
            <line x1="18" y1="10" x2="18" y2="22" stroke={colors.accent} strokeWidth="1" opacity="0.6"/>
            <line x1="14" y1="14" x2="22" y2="14" stroke={colors.accent} strokeWidth="1" opacity="0.6"/>
            
            {/* Center accent dot */}
            <circle cx="18" cy="16" r="1.5" fill={colors.accent} filter="url(#glow)"/>
          </g>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          {showTagline && (
            <span 
              className="text-xs font-medium font-rajdhani tracking-wide mb-1 opacity-80"
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