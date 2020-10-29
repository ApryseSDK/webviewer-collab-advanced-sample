import dotenv from 'dotenv';
import * as util from 'util';
import * as path from 'path';

dotenv.config();

const exec = util.promisify(require('child_process').exec);

(async () => {

  const scriptLocation = path.resolve(__dirname, '../node_modules/@pdftron/collab-db-postgresql');
  const scriptName = 'init-pg';

  const host = process.env.POSTGRES_HOST;
  const username = process.env.POSTGRES_USERNAME;
  const password = process.env.POSTGRES_PASSWORD;
  const dbName = process.env.POSTGRES_DB_NAME;

  const command = `cd ${scriptLocation} && yarn ${scriptName} --host=${host} --username=${username} --password=${password} --dbName=${dbName}`;

  const { stdout, stderr } = await exec(command);

  if (stdout) {
    console.log(stdout)
  }

  if (stderr) {
    console.warn(stderr);
    return;
  }

  console.log('Done!');
})()