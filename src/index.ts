import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router as runeliteRouter } from './runelite/router';
import { router as runescapeRouter } from './runescape/router';
import DBService from './services/DBService';

dotenv.config();

const app = express();
const port = 3000;

// Options
app.set('etag', true);

const corsOptions = {
  maxAge: 86400,
  methods: 'GET',
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use('/runelite', runeliteRouter);
app.use('/runescape', runescapeRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'There was an internal error. Please try again later.' });
  next();
});

if ('ONLY_TYPECHECK_AND_DO_NOT_RUN' in process.env) {
  console.log('ONLY_TYPECHECK_AND_DO_NOT_RUN env variable was set. Exiting.');
  process.exit();
}

const server = app.listen(port, async () => {
  await DBService.getConnection();
  console.log(`Running server on http://localhost:${port}`);
  if (typeof process.send === 'function') process.send('ready'); // pm2 ready signal
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing down Express server');

  server.close(async () => {
    console.log('HTTP server closed');

    if (DBService.conn) await DBService.conn.close();
    console.log('DB connection closed');
    process.exit();
  });
});
