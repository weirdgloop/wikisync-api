import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import runelite from './routes/runelite';
import BadRequestError from './errors/BadRequestError';
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
app.use('/runelite', runelite);

// Error handling
app.use((err, req, res, next) => {
  if (err instanceof BadRequestError) {
    res.status(400).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'There was an internal error. Please try again later.' });
  }
  next();
});

app.listen(port, async () => {
  await DBService.getConnection();
  console.log(`Running server on http://localhost:${port}`);
});
