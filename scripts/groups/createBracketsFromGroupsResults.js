require('dotenv').config();
const got = require('got');

const {
  CHALLONGE_USERNAME,
  CHALLONGE_API_KEY,
  CHALLONGE_TOURNAMENT_ID,
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

const baseUrl = `https://${CHALLONGE_USERNAME}:${CHALLONGE_API_KEY}@api.challonge.com/v1/tournaments/${CHALLONGE_TOURNAMENT_ID}`;
const results = require('../../docs/data/groups-results.json');

(async () => {
  const { body: participants } = await got(`${baseUrl}/participants.json`, { responseType: "json" });
  const { rows: matches } = await pool.query(`select 
    p1.seed as p1seed,
    p1.group as p1group,
    p2.seed as p2seed,
    p2.group as p2group
  from (
    select seed, "group"
    from players
    where seed <= 32 and not elite
    order by seed
  ) p1 join (
    select seed, "group"
    from players
    where seed > 32 and seed <= 64 and not elite
    order by seed
  ) p2 on p1.seed = 65 - p2.seed`);

  let position = 1;
  const seeds = [];
  results.forEach((row, i) => {
    if (position < 3) {
      const match = matches.find(match => (position == 1 && match.p1group == row.group) || (position == 2 && match.p2group == row.group));
      if (position == 1) {
        match.p1 = `${row.username} (1st of G${row.group}, orig seed ${match.p1seed})`;
        match.p1Id = row.id;
        seeds[match.p1seed] = participants.find(({ participant }) => participant.misc == match.p1Id);
      } else {
        match.p2 = `${row.username} (2nd of G${row.group}, orig seed ${match.p2seed})`;
        match.p2Id = row.id;
        seeds[match.p2seed] = participants.find(({ participant }) => participant.misc == match.p2Id);
      }
    }
    position = results[i+1]?.group != row.group ? 1 : position + 1;
  });

  for (let i = 1; i < seeds.length; ++i) {
    const { participant } = seeds[i];
    console.log('seed', i, participant.name);
    await got.put(`${baseUrl}/participants/${participant.id}.json`, {
      json: {
        participant: {
          seed: i
        }
      }
    });
  }

  // for (const match of matches) {
  //   console.log(`${match.p1.padEnd(50)} vs ${match.p2}`);
	// 	const { rows: [row] } = await pool.query(`insert into matches (stage) values ($1) returning id`, ['ro64']);
	// 	await pool.query(`insert into matches_players (matches_id, players_id) values ($1, $2), ($1, $3)`, [
	// 		row.id,
	// 		match.p1Id,
	// 		match.p2Id
	// 	]);
  // }
  process.exit(0);
})();
