import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

const FloatingAdminButton = () => {
  const navigate = useNavigate();
  
  const handleAdminClick = () => {
    const currentHost = window.location.hostname;
    
    // For Emergent.sh preview and development, always use internal routing
    if (currentHost.includes('localhost') || 
        currentHost.includes('preview.emergentagent.com') ||
        currentHost.includes('.emergentagent.com') ||
        currentHost.includes('emergent')) {
      // Development/Preview environment - navigate to internal dashboard route
      navigate('/admin-dashboard');
    } else if (currentHost === 'sentratech.net' || currentHost === 'www.sentratech.net') {
      // Only use external domain in actual production
      window.open('https://admin.sentratech.net', '_blank');
    } else {
      // Fallback - navigate to internal dashboard route
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleAdminClick}
        className="w-16 h-16 bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        title="Admin Dashboard"
        aria-label="Open Admin Dashboard"
      >
        <Settings size={24} />
      </button>
    </div>
  );
};

export default FloatingAdminButton;