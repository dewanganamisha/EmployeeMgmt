// Applies db/schema.sql (and db/seed.sql with --seed) to the configured database.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function run() {
  const files = ['schema.sql'];
  if (process.argv.includes('--seed')) files.push('seed.sql');

  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', file), 'utf8');
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
}

run()
  .catch((err) => {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
