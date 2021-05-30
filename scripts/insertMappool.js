require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  PUBLIC_URL
} = process.env;

const got = require("got");
const { Pool } = require('pg');
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

const stage = 'qf';

(async () => {
  const { rows: [admin] } = await pool.query(`select token from directus_users where first_name = $1 and last_name = $2`, ['Admin', 'User']);
  pool.end();
  const maps = [
    ['Rice', '2248050', 2],
    ['Rice', '892220', 2],
    ['Rice', '2553647'],
    ['Rice', '1978443'],
    ['Rice', '2206806'],
    ['Rice', '2217143'],
    ['LN', '2487451', 2],
    ['LN', '2382774', 2],
    ['LN', '2039701', 2],
    ['Hybrid', '2669198'],
    ['Hybrid', '1729302'],
    ['Tiebreaker (rice)', '1466198'],
    ['Tiebreaker (hybrid)', '2419040']
  ];
  for (let order = 1; order <= maps.length; order += 1) {
    const [category, id, weight] = maps[order-1];
    console.log(category, id, weight);
    await got.post(`${PUBLIC_URL}/items/maps?access_token=${admin.token}`, {
      json: {
        id,
        stage,
        category,
        order,
        weight
      }
    });
  }
})();
