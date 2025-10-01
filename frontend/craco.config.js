// Load configuration from environment or config file
const path = require('path');

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === 'true',
};

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig, { env }) => {
      
      // Production optimizations
      if (env === 'production') {
        // Bundle splitting for better caching and performance
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Vendor chunk for stable third-party libraries
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 20,
                reuseExistingChunk: true,
                maxSize: 200000, // 200KB max per chunk
              },
              // Heavy libraries in separate chunks
              framerMotion: {
                test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                name: 'framer-motion',
                chunks: 'all',
                priority: 30,
                reuseExistingChunk: true,
              },
              three: {
                test: /[\\/]node_modules[\\/]three[\\/]/,
                name: 'three',
                chunks: 'all',
                priority: 30,
                reuseExistingChunk: true,
              },
              supabase: {
                test: /[\\/]node_modules[\\/]@supabase[\\/]/,
                name: 'supabase',
                chunks: 'all',
                priority: 30,
                reuseExistingChunk: true,
              },
              radixUI: {
                test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
                name: 'radix-ui',
                chunks: 'all',
                priority: 25,
                reuseExistingChunk: true,
              },
              // Common chunk for shared code
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
                maxSize: 100000, // 100KB max
              },
            },
          },
          // Modern JS output
          moduleIds: 'deterministic',
          runtimeChunk: 'single',
        };

        // Performance hints
        webpackConfig.performance = {
          maxAssetSize: 500000, // 500KB
          maxEntrypointSize: 500000, // 500KB
          hints: 'warning',
        };
      }
      
      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });
        
        // Disable watch mode
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }
      
      return webpackConfig;
    },
  },
  babel: {
    plugins: [
      // Enable tree shaking for specific libraries
      ...(process.env.NODE_ENV === 'production' ? [
        ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash'],
      ] : []),
    ],
  },
};