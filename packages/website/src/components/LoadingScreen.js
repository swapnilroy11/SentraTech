import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Loading animation */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-[rgba(0,255,65,0.3)] rounded-full animate-spin border-t-[#00FF41]"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-[#00FF41] border-r-[#00FF41]"></div>
        </div>
        
        {/* SentraTech logo/text */}
        <div className="font-rajdhani font-bold text-2xl text-white mb-2">
          SentraTech
        </div>
        <div className="text-[#00FF41] text-sm">
          Loading...
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;