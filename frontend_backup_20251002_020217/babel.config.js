module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ],
  plugins: [
    // Only include plugins that are actually needed
    '@babel/plugin-proposal-private-property-in-object'
  ]
};