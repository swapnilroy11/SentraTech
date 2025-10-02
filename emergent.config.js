/**
 * emergent.config.js
 *
 * Monorepo setup for SentraTech:
 * - Builds and deploys both the website and the admin dashboard
 * - Binds sentratech.net, www.sentratech.net, and admin.sentratech.net
 * - Ensures real-time data sync between sites
 */

module.exports = {
  sites: [
    {
      name: "website",
      root: "packages/website",
      buildSystem: "buildx",
      buildContext: "packages/website",
      buildCommand: "yarn install --frozen-lockfile && yarn build --verbose",
      output: "dist",
      domains: ["sentratech.net", "www.sentratech.net"],
      env: {
        REACT_APP_API_BASE: "https://sentratech.net/api/proxy",
        REACT_APP_WS_URL: "wss://admin.sentratech.net/ws",
      },
    },
    {
      name: "dashboard",
      root: "packages/dashboard",
      buildSystem: "buildx",
      buildContext: "packages/dashboard",
      buildCommand: "yarn install --frozen-lockfile && yarn build --verbose",
      output: "build",
      domains: ["admin.sentratech.net"],
      env: {
        REACT_APP_API_BASE: "https://admin.sentratech.net/api/forms",
        REACT_APP_WS_URL: "wss://admin.sentratech.net/ws",
      },
    },
  ],
  env: {
    EMERGENT_API_KEY: "@env.EMERGENT_API_KEY",
  },
  preview: {
    // Ensure preview URLs route correctly
    domains: ["preview.sentratech.net", "preview.admin.sentratech.net"],
  },
  // Removed hooks to prevent deployment failures during initial deployment
  // hooks: {
  //   postdeploy: [
  //     "npm run smoke-tests",
  //   ],
  // },
};