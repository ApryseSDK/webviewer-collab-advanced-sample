import dotenv from 'dotenv';
import * as util from 'util';
import * as path from 'path';

dotenv.config();

const exec = util.promisify(require('child_process').exec);

(async () => {
  const scriptLocation = path.resolve(__dirname, '../node_modules/@pdftron/collab-db-postgresql');
  const scriptName = 'start-local-db';
  const password = process.env.POSTGRES_PASSWORD;
  const command = `cd ${scriptLocation} && yarn ${scriptName} --password=${password}`;

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
