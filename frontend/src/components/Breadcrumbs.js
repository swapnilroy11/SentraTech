import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNames = {
    'features': 'Features & Journey',
    'case-studies': 'Case Studies',
    'integrations': 'Integrations',
    'security': 'Security & Compliance',
    'pricing': 'Pricing',
    'demo-request': 'Demo Request'
  };

  if (location.pathname === '/') return null;

  return (
    <div className="container mx-auto px-6 pt-24 pb-4">
      <nav className="flex items-center space-x-2 text-sm">
        <Link 
          to="/" 
          className="text-[#e2e8f0] hover:text-[#00FF41] transition-colors"
        >
          Home
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <React.Fragment key={name}>
              <ChevronRight size={14} className="text-[#666]" />
              {isLast ? (
                <span className="text-[#00FF41] font-medium">{displayName}</span>
              ) : (
                <Link 
                  to={routeTo}
                  className="text-[#e2e8f0] hover:text-[#00FF41] transition-colors"
                >
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;