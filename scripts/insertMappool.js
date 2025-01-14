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

const stage = 'gf';

(async () => {
  const { rows: [admin] } = await pool.query(`select token from directus_users where first_name = $1 and last_name = $2`, ['Admin', 'User']);
  pool.end();
  const maps = [
    ['Rice', '2953483', 2],
    ['Rice', '2920587', 2],
    ['Rice', '2530212'],
    ['Rice', '2736533'],
    ['Rice', '3072219'],
    ['Rice', '2358415'],
    ['Rice', '2757378'],
    ['Rice', '1531892'],
    ['LN', '2793968', 2],
    ['LN', '2972364', 2],
    ['LN', '2897845', 2],
    ['Hybrid', '2546587'],
    ['Hybrid', '2180344'],
    ['Hybrid', '1989158'],
    ['Hybrid', '2483939'],
    ['Tiebreaker (rice)', '3054273'],
    ['Tiebreaker (hybrid)', '3054623'],
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
