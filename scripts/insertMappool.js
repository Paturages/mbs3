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

const stage = 'sf';

(async () => {
  const { rows: [admin] } = await pool.query(`select token from directus_users where first_name = $1 and last_name = $2`, ['Admin', 'User']);
  pool.end();
  const maps = [
    ['Rice', '2829360', 2],
    ['Rice', '2996967', 2],
    ['Rice', '981646'],
    ['Rice', '2854334'],
    ['Rice', '1913067'],
    ['Rice', '2767953'],
    ['Rice', '2723224'],
    ['LN', '2641964', 2],
    ['LN', '3034826', 2],
    ['LN', '2110798', 2],
    ['Hybrid', '1995529'],
    ['Hybrid', '2938244'],
    ['Hybrid', '2316593'],
    ['Tiebreaker (rice)', '1703189'],
    ['Tiebreaker (hybrid)', '2129202']
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
