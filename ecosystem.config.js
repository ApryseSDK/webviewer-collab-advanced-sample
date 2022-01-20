/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

require('dotenv').config({
  path: path.resolve('../.env.production'),
});

module.exports = {
  apps: [
    {
      name: 'server',
      script: 'NODE_ENV=production sudo systemctl start docker && npx ts-node server/index.ts',
    },
  ],
  deploy: {
    production: {
      user: process.env.PM2_SERVER_USER,
      host: [process.env.PM2_SERVER_HOST],
      ref: 'origin/master',
      repo: 'git@github.com:PDFTron/webviewer-collab-advanced-sample.git',
      path: `/home/${process.env.PM2_SERVER_USER}`,
      env: {
        NODE_ENV: 'production',
      },
      key: process.env.PM2_SERVER_KEY_PATH,
      'post-deploy':
        'yarn && yarn build-client && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
