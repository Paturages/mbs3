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

(async () => {
  const { body: participants } = await got(`${baseUrl}/participants.json`, { responseType: "json" });
  //const { body: matches } = await got(`${baseUrl}/matches.json`, { responseType: "json" });
  const { rows: players } = await pool.query(`select id, username from players where alive and not elite`);

  for (const { participant } of participants) {
    const player = players.find(p => p.username == participant.name);
    console.log('Updating', player.username, player.id);
    await got.put(`${baseUrl}/participants/${participant.id}.json`, {
      json: {
        participant: {
          misc: player.id
        }
      }
    })
  }
})();
