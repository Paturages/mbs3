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
  const { rows: matches } = await pool.query(`select id, link from matches where link is not null and wbd is null and id not in (select match from scores)`);
  const { rows: maps } = await pool.query(`select id from maps where stage = $1`, ['groups']);
  const mapsSet = new Set(maps.map(m => m.id));
  let { rows: matchesPlayers } = await pool.query(`select matches_id, players_id from matches_players`);
  matchesPlayers = matchesPlayers.reduce((obj, mp) => {
    if (!obj[mp.matches_id]) obj[mp.matches_id] = {};
    obj[mp.matches_id][mp.players_id] = true;
    return obj;
  }, {}); 
  
  for (const { id, link } of matches) {
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

    for (const game of body.games) {
      if (!mapsSet.has(game.beatmap_id)) continue;

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
        if (!matchesPlayers[id][user_id]) {
          console.warn(user_id, 'should not be in match', id);
          continue;
        }

        await pool.query(`
          insert into scores
          (player, map, match, score, combo, c320, c300, c200, c100, c50, c0)
          values
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          on conflict (match, player, map) do update set
            score = $4,
            combo = $5,
            c320 = $6,
            c300 = $7,
            c200 = $8,
            c100 = $9,
            c50 = $10,
            c0 = $11
        `, [
          user_id,
          game.beatmap_id,
          id,
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

  process.exit(0);
})();
