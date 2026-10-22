const { Pool } = require('pg');

// pg reads PGHOST, PGPORT, PGUSER, PGPASSWORD and PGDATABASE from the environment.
const pool = new Pool();

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err.message);
});

module.exports = pool;
