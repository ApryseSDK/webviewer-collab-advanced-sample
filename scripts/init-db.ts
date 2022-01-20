import dotenv from 'dotenv';
import * as util from 'util';
import * as path from 'path';

const envPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../.env.production')
    : path.resolve(__dirname, '../.env.local');

dotenv.config({ path: envPath });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

(async () => {
  const scriptLocation = path.resolve(__dirname, '../node_modules/@pdftron/collab-db-postgresql');
  const scriptName = 'init-db';

  const host = process.env.POSTGRES_HOST;
  const username = process.env.POSTGRES_USERNAME;
  const password = process.env.POSTGRES_PASSWORD;
  const dbName = process.env.POSTGRES_DB_NAME;
  const port = process.env.POSTGRES_PORT;

  const command = `cd ${scriptLocation} && yarn ${scriptName} --host=${host} --username=${username} --password=${password} --dbName=${dbName} --port=${port}`;

  const { stdout, stderr } = await exec(command);

  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    console.warn(stderr);
    return;
  }

  console.log('Done!');
})();
