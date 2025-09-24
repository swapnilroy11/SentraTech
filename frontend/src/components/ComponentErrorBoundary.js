import React from 'react';
import { motion } from 'framer-motion';

class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6"
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-[rgba(255,107,107,0.1)] rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="text-4xl">⚠️</div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              Oops! Something went wrong
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-8">
              We're experiencing a temporary issue loading this page. Our team has been notified.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-3 rounded-xl transition-all duration-300"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="border border-[#00FF41] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] font-semibold px-8 py-3 rounded-xl transition-all duration-300"
              >
                Go Back
              </button>
            </div>

            {/* Debug info (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 p-4 bg-[rgba(255,107,107,0.1)] rounded-lg border border-[rgba(255,107,107,0.3)] text-left">
                <summary className="text-[#FF6B6B] font-semibold cursor-pointer">
                  Debug Information (Development Only)
                </summary>
                <div className="mt-4 text-sm text-[rgb(161,161,170)]">
                  <p><strong>Error:</strong> {this.state.error?.toString()}</p>
                  <p><strong>Component Stack:</strong></p>
                  <pre className="whitespace-pre-wrap text-xs mt-2">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;