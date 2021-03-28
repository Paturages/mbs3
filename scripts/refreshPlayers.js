require('dotenv').config();

const {
  OAUTH_OSU_KEY,
  OAUTH_OSU_SECRET,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
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

(async () => {
  const {
    body: { access_token },
  } = await got.post("https://osu.ppy.sh/oauth/token", {
    json: {
      client_id: OAUTH_OSU_KEY,
      client_secret: OAUTH_OSU_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    },
    responseType: "json",
  });

  const { rows } = await pool.query('select * from players');
  for (const player of rows) {
    const { body: user } = await got(
      `https://osu.ppy.sh/api/v2/users/${player.id}/mania`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        responseType: "json",
      }
    );
    const rankStatus = user.statistics.variants.find(
      (v) => v.variant === "4k"
    );
    console.log(player.id.padEnd(10), player.username.padEnd(20), player.ranking, '->', rankStatus.global_rank);
    await pool.query('update players set date_updated = now(), ranking = $2 where id = $1', [player.id, rankStatus.global_rank]);
    await new Promise(r => setTimeout(r, 750));
  }
})();
