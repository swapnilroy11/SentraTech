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
    // Required to fix babel-preset-react-app warning
    '@babel/plugin-proposal-private-property-in-object'
  ]
};