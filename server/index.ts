import { getHash, getUserFromToken, comparePassword } from './auth';
import CollabServer from '@pdftron/collab-server';
import CollabDBPostgreSQL from '@pdftron/collab-db-postgresql';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Collaboration server
 */
const db = new CollabDBPostgreSQL({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  dbName: process.env.POSTGRES_DB_NAME,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  // logLevel: CollabDBPostgreSQL.LogLevels.DEBUG
});

db.connectDB();

const resolvers = db.getResolvers();
const corsOption = {
  origin: true,
  credentials: true,
};

const server = new CollabServer({
  resolvers,
  corsOption,
  getUserFromToken,
  logLevel: CollabServer.LogLevels.DEBUG,
});

//@ts-ignore
db.setServer(server);
server.start(3000);

const app = express();

app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json());

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
      type: 'STANDARD',
    });
  } else {
    newUser = await db.createUser({
      userName: username,
      email,
      password: passwordHash,
    });
  }

  if (newUser) {
    res.status(200).send({
      user: newUser,
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
