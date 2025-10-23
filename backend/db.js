const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  database: process.env.PGDATABASE || 'osamadb',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '0000',
});

module.exports = pool;