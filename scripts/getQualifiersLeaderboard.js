require('dotenv').config();
const got = require('got');

const {
  OSU_V1_KEY,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
} = process.env;

const { Pool } = require('pg');
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

(async () => {
  await pool.query(`delete from qualifier_scores`);
  const { rows: lobbies } = await pool.query(`select name, link from qualifier_lobbies where link is not null`);
  
  for (const { name, link } of lobbies) {
    const mpId = link.split('/').pop();
    console.log(`Fetching match ID ${mpId}...`);
    const { body } = await got(`https://osu.ppy.sh/api/get_match`, {
      responseType: "json",
      searchParams: {
        k: OSU_V1_KEY,
        mp: mpId,
      },
    });
    await new Promise(r => setTimeout(r, 100));

    const scores = {};
    const picks = {};
    for (const game of body.games) {
      if (!scores[game.beatmap_id]) scores[game.beatmap_id] = [];
      if (!picks[game.beatmap_id]) picks[game.beatmap_id] = 0;

      for (const {
        user_id,
        score,
        maxcombo,
        countmiss,
        count50,
        count100,
        countkatu,
        count300,
        countgeki,
      } of game.scores) {
        await pool.query(`
          insert into qualifier_scores
          (player, map, lobby, score, combo, c320, c300, c200, c100, c50, c0)
          values
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          user_id,
          game.beatmap_id,
          name,
          score,
          maxcombo,
          countgeki,
          count300,
          countkatu,
          count100,
          count50,
          countmiss
        ]);
      }
    }
  }

})();
