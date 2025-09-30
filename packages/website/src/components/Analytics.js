import { useEffect } from 'react';
import usePageViews from '../hooks/usePageViews';

const Analytics = () => {
  // Initialize pageview tracking
  usePageViews();
  
  // This component doesn't render anything visible
  return null;
};

export default Analytics;