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

const baseUrl = `https://${CHALLONGE_USERNAME}:${CHALLONGE_API_KEY}@api.challonge.com/v1/tournaments/${CHALLONGE_TOURNAMENT_ID}${process.argv[2] || ''}`;
const currentStage = 'f';

(async () => {
  console.log('Fetching matches...');
  const { body: allChallongeMatches } = await got(`${baseUrl}/matches.json`, { responseType: "json" });
  console.log('Fetching participants...');
  const { body: participants } = await got(`${baseUrl}/participants.json`, { responseType: "json" });

  // Challonge round values are negative if they're in the loser's bracket, e.g. losers round 2 is "-2"
  const openLoserChallongeMatches = allChallongeMatches.filter(({ match }) => match.state == 'open' && match.round < 0);
  for (const { match: challongeMatch } of allChallongeMatches) {
    const prematch1 = openLoserChallongeMatches.find(({ match }) => challongeMatch.player1_prereq_match_id == match.id);
    const prematch2 = openLoserChallongeMatches.find(({ match }) => challongeMatch.player2_prereq_match_id == match.id);
    if (!prematch1 || !prematch2) continue;
    
    const { participant: p1a } = participants.find(({ participant }) => participant.id == prematch1.match.player1_id);
    const { participant: p1b } = participants.find(({ participant }) => participant.id == prematch1.match.player2_id);
    const { participant: p2a } = participants.find(({ participant }) => participant.id == prematch2.match.player1_id);
    const { participant: p2b } = participants.find(({ participant }) => participant.id == prematch2.match.player2_id);

    console.log('Winner of ', p1a.name, '/', p1b.name, ' vs. ', 'Winner of ', p2a.name, '/', p2b.name);
    const { rows: matches } = await pool.query(
      `insert into matches (stage, loser, dependencies)
      values ($1, true, 'todo'), ($1, true, 'todo'), ($1, true, 'todo'), ($1, true, 'todo') returning id`,
      [currentStage]
    );
    await pool.query(
      `insert into matches_players (matches_id, players_id)
      values
        ($1, $5), ($1, $6),
        ($2, $7), ($2, $8),
        ($3, $9), ($3, $10),
        ($4, $11), ($4, $12)`,
      [
        matches[0].id,
        matches[1].id,
        matches[2].id,
        matches[3].id,
        p1a.misc, p2a.misc,
        p1b.misc, p2a.misc,
        p1a.misc, p2b.misc,
        p1b.misc, p2b.misc
      ]
    );
    // TODO: Update match dependencies
  }
})();
