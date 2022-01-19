import { getHash, getUserFromToken, comparePassword } from './auth';
import CollabServer from '@pdftron/collab-server';
import CollabDBPostgreSQL from '@pdftron/collab-db-postgresql';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserTypes } from '@pdftron/collab-db-postgresql/types/types/resolvers-types';
import * as proxy from 'http-proxy-middleware';
import * as path from 'path';
import faker from 'faker';
import { CronJob } from 'cron';

dotenv.config();

/**
 * Collaboration server
 */
const corsOption = {
  origin: true,
  credentials: true,
};

const db = new CollabDBPostgreSQL({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  dbName: process.env.POSTGRES_DB_NAME,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  // logLevel: CollabDBPostgreSQL.LogLevels.DEBUG
});

(async () => {
  await db.connectDB();

  const server = new CollabServer({
    resolvers: db.getResolvers(),
    corsOption,
    getUserFromToken,
    unknownInviteStrategy: CollabServer.UnknownInviteStrategies.CREATE,
    permissions: {
      snapshot: {
        restore: 'any',
      },
    },
    // logLevel: CollabServer.LogLevels.DEBUG,
  });

  server.start(3000);
})();

const app = express();

app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json());

app.post('/signup/random', async (req, res) => {
  const email = faker.internet.email();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const passwordHash = await getHash(password);

  const newUser = await db.createUser({
    userName: username,
    email,
    password: passwordHash,
  });

  const token = jwt.sign(
    {
      id: newUser.id,
      email,
    },
    process.env.COLLAB_KEY
  );

  res.cookie('wv-collab-token', token);
  res.status(200).send({
    user: newUser,
    token,
    info: {
      email,
      password,
      username,
    },
  });
});

/**
 * Create a new user and return the User object
 */
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await getHash(password);

  const existing = await db.getUserByEmail(email);
  let newUser;
  if (existing) {
    if (existing.type !== 'ANONYMOUS') {
      return res.status(401).send({
        error: 'User already exists',
      });
    }

    newUser = await db.editUser({
      id: existing.id,
      userName: username,
      password: passwordHash,
      type: 'STANDARD' as UserTypes,
    });
  } else {
    newUser = await db.createUser({
      userName: username,
      email,
      password: passwordHash,
    });
  }

  if (newUser) {
    const token = jwt.sign(
      {
        id: newUser.id,
        email,
      },
      process.env.COLLAB_KEY
    );

    res.cookie('wv-collab-token', token);

    res.status(200).send({
      user: newUser,
      token,
    });
  } else {
    res.status(400).send();
  }
});

app.get('/token', async (req, res) => {
  res.send({
    token: req.cookies['wv-collab-token'],
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getUserByEmail(email);
  if (!user) {
    res.status(401).send();
    return;
  }

  // @ts-ignore
  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error('Password is invalid');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email,
    },
    process.env.COLLAB_KEY
  );

  res.cookie('wv-collab-token', token);

  res.send({
    user,
    token,
  });
});

app.post('/logout', async (req, res) => {
  res.clearCookie('wv-collab-token').send();
});

/**
 * Start the server
 */
const s = app.listen(8080, () => {
  console.log(`[auth] Authentication server listening on port 8080`);
});

process.on('SIGINT', function () {
  s.close();
  process.exit();
});

/**
 * Start a reverse proxy on port 1234
 */
const proxyApp = express();

proxyApp.use(
  '/auth',
  proxy.createProxyMiddleware({
    target: 'http://localhost:8080',
    pathRewrite: (path) => {
      return path.replace('/auth', '');
    },
  })
);

proxyApp.use(
  '/api/subscribe',
  proxy.createProxyMiddleware({
    target: 'http://localhost:3000',
    pathRewrite: (path) => {
      return path.replace('/api/subscribe', '/subscribe');
    },
    ws: true,
  })
);

proxyApp.use(
  '/api',
  proxy.createProxyMiddleware({
    target: 'http://localhost:3000',
    pathRewrite: (path) => {
      return path.replace('/api', '');
    },
  })
);

const routes = ['/', '/login', '/view', '/view/*', '/signup'];

const handler = (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html'));

routes.forEach((route) => proxyApp.get(route, handler));

proxyApp.use(express.static(path.resolve(__dirname, '../dist')));

proxyApp.listen(1234, () => {
  console.log('Proxy server started on port 1234');
});

const emptyDB = async () => {
  // @ts-ignore
  await db.dbClient.query(
    `TRUNCATE documents, users, document_members, annotations, annotation_members, mentions`
  );

  const username = process.env.TEMP_PDFTRON_USERNAME;
  const email = process.env.TEMP_PDFTRON_EMAIL;
  const password = process.env.TEMP_PDFTRON_PASSWORD;

  if (username && email && password) {
    const passwordHash = await getHash(password);

    // create a new temp user
    await db.createUser({
      userName: username,
      email,
      password: passwordHash,
    });
  }
};

const job = new CronJob('0 0 * * *', emptyDB, null, true, 'America/Los_Angeles');
job.start();
