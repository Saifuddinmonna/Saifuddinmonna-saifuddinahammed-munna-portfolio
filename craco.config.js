module.exports = {
  webpack: {
    configure: webpackConfig => {
      // Optimize chunk splitting
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
        runtimeChunk: {
          name: "runtime",
        },
      };

      // Increase timeout for chunk loading
      webpackConfig.output = {
        ...webpackConfig.output,
        chunkLoadTimeout: 120000,
        publicPath: "/",
      };

      // Add performance hints
      webpackConfig.performance = {
        ...webpackConfig.performance,
        hints: "warning",
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };

      return webpackConfig;
    },
  },
};
