import express from 'express';
import bodyParser from 'body-parser';
import runelite from './routes/runelite';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/runelite', runelite);

app.listen(port, () => {
  console.log(`Running server on http://localhost:${port}`);
});
