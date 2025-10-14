module.exports = {
  build: {
    buildCommand: 'echo "Dockerfile builds the app"',
    context: '.',
    dockerfile: 'Dockerfile',
    cache: { enabled: true }
  }
};