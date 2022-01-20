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
  console.log(`Starting server with the following config:`);
  console.log({
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    mount: process.env.POSTGRES_MOUNT,
  });

  const scriptLocation = path.resolve(__dirname, '../node_modules/@pdftron/collab-db-postgresql');
  const scriptName = 'start-local-db';
  const password = process.env.POSTGRES_PASSWORD;
  const command = `cd ${scriptLocation} && yarn ${scriptName} --password=${password} -n collab-demo-advanced -p ${process.env.POSTGRES_PORT} -d ${process.env.POSTGRES_MOUNT}`;

  const { stdout, stderr } = await exec(command);

  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    console.warn(stderr);
    return;
  }

  console.log('Done! Created a docker image with the following properties:');
  console.log(
    JSON.stringify({
      dbName: 'collab',
      username: 'postgres',
      password,
      containerName: 'pg-docker',
    })
  );
})();
