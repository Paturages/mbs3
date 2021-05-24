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

const stage = 'ro16';

(async () => {
  const { rows: [admin] } = await pool.query(`select token from directus_users where first_name = $1 and last_name = $2`, ['Admin', 'User']);
  pool.end();
  const maps = [
    ['Rice', 'https://osu.ppy.sh/beatmaps/1215685', 2],
    ['Rice', 'https://osu.ppy.sh/beatmaps/2663564', 2],
    ['Rice', 'https://osu.ppy.sh/beatmaps/1869523'],
    ['Rice', 'https://osu.ppy.sh/beatmaps/2918442'],
    ['Rice', 'https://osu.ppy.sh/beatmaps/2481154'],
    ['Rice', 'https://osu.ppy.sh/beatmaps/2999092'],
    ['LN', 'https://osu.ppy.sh/beatmaps/2745911', 2],
    ['LN', 'https://osu.ppy.sh/beatmaps/2856841', 2],
    ['LN', 'https://osu.ppy.sh/beatmaps/3011048', 2],
    ['Hybrid', 'https://osu.ppy.sh/beatmaps/2541097'],
    ['Hybrid', 'https://osu.ppy.sh/beatmaps/2586726'],
    ['Tiebreaker (rice)', 'https://osu.ppy.sh/beatmaps/2681840'],
    ['Tiebreaker (hybrid)', 'https://osu.ppy.sh/beatmaps/2027535']
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
