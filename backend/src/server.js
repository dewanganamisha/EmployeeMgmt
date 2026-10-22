require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Could not connect to PostgreSQL:', err.message);
    console.error('Check your backend/.env settings and that the database is running.');
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

start();
