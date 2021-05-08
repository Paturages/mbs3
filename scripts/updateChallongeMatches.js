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
  console.log('Fetching participants...');
  const { body: participants } = await got(`${baseUrl}/participants.json`, { responseType: "json" });
  console.log('Fetching matches...');
  const { body: challongeMatches } = await got(`${baseUrl}/matches.json`, { responseType: "json" });

  console.log('Fetching tournament data...');
  const { rows: matches } = await pool.query(`select m.id, m.wbd, array_agg(players_id) as player_ids from matches_players mp join matches m on m.id = mp.matches_id group by m.id, m.wbd`);
  const { rows: scores } = await pool.query(`select match, player, map, score from scores`);
  const { rows: picks } = await pool.query(`select match, map from picks`);

  const participantsMap = new Map(participants.map(({ participant }) => [participant.misc, participant]));

  for (const match of matches) {
    const matchPicks = picks.filter(p => p.match == match.id);
    if (!matchPicks.length && !match.wbd) continue;
    const participants = match.player_ids.map(id => participantsMap.get(id));
    console.log(`${participants[0].name} (${participants[0].misc}) vs. ${participants[1].name} (${participants[1].misc})`);
    
    // group_player_ids[0] is for group stage players, for some reason
    const challongeMatch = challongeMatches.find(m =>
      (m.match.player1_id == participants[0].group_player_ids[0] && m.match.player2_id == participants[1].group_player_ids[0]) ||
      (m.match.player1_id == participants[1].group_player_ids[0] && m.match.player2_id == participants[0].group_player_ids[0])
    ).match;

    if (challongeMatch.state != 'open') continue;

    const [participant1, participant2] = challongeMatch.player1_id == participants[0].group_player_ids[0] ? participants : participants.reverse();
    if (match.wbd) {
      console.log('WBD', match.wbd);
      await got.put(`${baseUrl}/matches/${challongeMatch.id}.json`, {
        json: {
          match: {
            scores_csv: match.wbd == participant1.misc ? '4-0' : '0-4',
            winner_id: match.wbd == participant1.misc ? participant1.group_player_ids[0] : participant2.group_player_ids[0]
          }
        }
      });
      continue;
    }

    let score1 = 0, score2 = 0;
    matchPicks.forEach(p => {
      const { score: p1score } = scores.find(s => s.match == match.id && s.player == participant1.misc && s.map == p.map) || { score: 0 };
      const { score: p2score } = scores.find(s => s.match == match.id && s.player == participant2.misc && s.map == p.map) || { score: 0 };
      if (p1score > p2score) {
        score1 += 1;
      } else {
        score2 += 1;
      }
    });
    console.log(score1, '-', score2);
    
    if (score1 == 4 || score2 == 4) {
      await got.put(`${baseUrl}/matches/${challongeMatch.id}.json`, {
        json: {
          match: {
            scores_csv: `${score1}-${score2}`,
            winner_id: score1 == 4 ? participant1.group_player_ids[0] : participant2.group_player_ids[0]
          }
        }
      });
    }
  }
})();
