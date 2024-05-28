module.exports = {
  apps: [
    {
      name: 'dev.frontend.moonshot.tech',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 8009,
      },
    },
    // PRODUCTION
    {
      name: 'prod.frontend.moonshot.tech',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 8109,
      },
    },
  ],
};
