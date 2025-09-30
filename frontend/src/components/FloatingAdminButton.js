import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from './ui/button';

const FloatingAdminButton = () => {
  const handleAdminClick = () => {
    // Determine admin URL based on current environment
    const currentHost = window.location.hostname;
    let adminUrl;
    
    if (currentHost.includes('localhost') || currentHost.includes('preview.emergentagent.com')) {
      // Development environment - use current domain with different port
      adminUrl = `${window.location.protocol}//${currentHost}:3001`;
    } else if (currentHost === 'sentratech.net' || currentHost === 'www.sentratech.net') {
      // Production environment
      adminUrl = 'https://admin.sentratech.net';
    } else {
      // Fallback
      adminUrl = 'https://admin.sentratech.net';
    }
    
    // Open dashboard in new tab
    window.open(adminUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-16 h-16">
        <Button
          onClick={handleAdminClick}
          className="w-full h-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          title="Admin Dashboard"
          aria-label="Open Admin Dashboard"
        >
          <Settings size={24} />
        </Button>
      </div>
    </div>
  );
};

export default FloatingAdminButton;