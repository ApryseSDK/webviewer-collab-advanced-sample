/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

require('dotenv').config({
  path: path.resolve('.env.production'),
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
        BUCKET_NAME: process.env.BUCKET_NAME,
        BUCKET_REGION: process.env.BUCKET_REGION,
        IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
        COLLAB_KEY: process.env.COLLAB_KEY,
        POSTGRES_HOST: process.env.POSTGRES_HOST,
        POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
        POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
        POSTGRES_PORT: process.env.POSTGRES_PORT,
        SERVER_URL: process.env.SERVER_URL,
        SUBSCRIBE_URL: process.env.SUBSCRIBE_URL,
        AUTH_URL: process.env.AUTH_URL,
        TEMP_PDFTRON_USERNAME: process.env.TEMP_PDFTRON_USERNAME,
        TEMP_PDFTRON_EMAIL: process.env.TEMP_PDFTRON_EMAIL,
        TEMP_PDFTRON_PASSWORD: process.env.TEMP_PDFTRON_PASSWORD,
        PM2_SERVER_HOST: process.env.PM2_SERVER_HOST,
        PM2_SERVER_USER: process.env.PM2_SERVER_USER,
        PM2_SERVER_KEY_PATH: process.env.PM2_SERVER_KEY_PATH,
      },
      key: process.env.PM2_SERVER_KEY_PATH,
      'post-deploy':
        'yarn && yarn build-client && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
