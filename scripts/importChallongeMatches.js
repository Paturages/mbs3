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
const currentStage = 'ro32';

// group_player_ids[0] is for group stage players, for some reason
const getId = (participant, stage) => stage == 'groups' ? participant.group_player_ids[0] : participant.id;

(async () => {
  console.log('Fetching matches...');
  const { body: challongeMatches } = await got(`${baseUrl}/matches.json?state=open`, { responseType: "json" });
  console.log('Fetching participants...');
  const { body: participants } = await got(`${baseUrl}/participants.json`, { responseType: "json" });

  for (const { match: challongeMatch } of challongeMatches) {
    const { participant: p1 } = participants.find(({ participant }) => participant.id == challongeMatch.player1_id);
    const { participant: p2 } = participants.find(({ participant }) => participant.id == challongeMatch.player2_id);
    console.log(p1.name, ' vs. ', p2.name);
    const { rows: [match] } = await pool.query(
      `insert into matches (stage) values ($1) returning id`,
      [currentStage]
    );
    await pool.query(
      `insert into matches_players (matches_id, players_id) values ($1, $2), ($1, $3)`,
      [match.id, p1.misc, p2.misc]
    );
  }
})();
