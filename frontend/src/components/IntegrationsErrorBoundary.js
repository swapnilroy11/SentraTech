import React from 'react';

class IntegrationsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Integrations page error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen bg-[#0D1117] flex items-center justify-center px-6"
          style={{ backgroundColor: '#0D1117', minHeight: '100vh' }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-[rgba(0,255,65,0.1)] rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="text-4xl text-[#00FF41]">⚠️</div>
            </div>
            
            <h1 className="text-4xl font-bold text-[#FFFFFF] mb-6 font-rajdhani">
              Integrations Loading Issue
            </h1>
            
            <p className="text-xl text-[#C9D1D9] mb-8">
              Something went wrong loading the integrations page. Please try refreshing or go back.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#00FF41] text-[#0D1117] hover:bg-[#00e83a] font-bold px-8 py-3 rounded-xl transition-all duration-300"
              >
                Reload Page
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="border-2 border-[#00FF41] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] font-bold px-8 py-3 rounded-xl transition-all duration-300"
              >
                Go Back
              </button>
            </div>

            {/* Debug info (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 p-4 bg-[rgba(255,107,107,0.1)] rounded-lg border border-[rgba(255,107,107,0.3)] text-left">
                <summary className="text-[#FF6B6B] font-semibold cursor-pointer">
                  Debug Information (Development Only)
                </summary>
                <div className="mt-4 text-sm text-[#C9D1D9]">
                  <p><strong>Error:</strong> {this.state.error?.toString()}</p>
                  <p><strong>Component Stack:</strong></p>
                  <pre className="whitespace-pre-wrap text-xs mt-2 bg-[#161B22] p-2 rounded">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default IntegrationsErrorBoundary;