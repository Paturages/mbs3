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

const stage = 'f';

(async () => {
  const { rows: [admin] } = await pool.query(`select token from directus_users where first_name = $1 and last_name = $2`, ['Admin', 'User']);
  pool.end();
  const maps = [
    ['Rice', '2787304', 2],
    ['Rice', '1417369', 2],
    ['Rice', '2658672'],
    ['Rice', '2322548'],
    ['Rice', '2553543'],
    ['Rice', '2569839'],
    ['Rice', '1116480'],
    ['LN', '2383210', 2],
    ['LN', '2818619', 2],
    ['LN', '2243452', 2],
    ['Hybrid', '2793919'],
    ['Hybrid', '2663884'],
    ['Hybrid', '3053542'],
    ['Tiebreaker (rice)', '3054273'],
    ['Tiebreaker (hybrid)', '3054623']
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
