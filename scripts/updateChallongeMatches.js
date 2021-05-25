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
const currentStage = 'ro16';

// group_player_ids[0] is for group stage players, for some reason
const getId = (participant, stage) => stage == 'groups' ? participant.group_player_ids[0] : participant.id;

(async () => {
  console.log('Fetching matches...');
  const { body: challongeMatches } = await got(`${baseUrl}/matches.json?state=open`, { responseType: "json" });
  console.log('Fetching participants...');
  const { body: participants } = await got(`${baseUrl}/participants.json`, { responseType: "json" });

  console.log('Fetching tournament data...');
  const { rows: matches } = await pool.query(`
    select m.id, m.wbd, m.dependencies, m.stage, s.best_of, array_agg(players_id) as player_ids
    from matches_players mp
    join matches m on m.id = mp.matches_id
    join stages s on s.slug = m.stage
    where m.stage = $1 and mp.players_id is not null
    group by m.id, s.best_of
  `, [currentStage]);
  const { rows: scores } = await pool.query(`select match, player, map, score from scores`);
  const { rows: picks } = await pool.query(`select match, map from picks`);

  const participantsMap = new Map(participants.map(({ participant }) => [participant.misc, participant]));

  for (const match of matches) {
    const matchPicks = picks.filter(p => p.match == match.id);
    if (!matchPicks.length && !match.wbd) continue;
    const participants = match.player_ids.map(id => participantsMap.get(id));
    
    const challongeMatch = challongeMatches.find(m =>
      (m.match.player1_id == getId(participants[0]) && m.match.player2_id == getId(participants[1])) ||
      (m.match.player1_id == getId(participants[1]) && m.match.player2_id == getId(participants[0]))
    )?.match;
      
    if (challongeMatch?.state != 'open') continue;
    console.log(`${participants[0].name} (${participants[0].misc}) vs. ${participants[1].name} (${participants[1].misc})`);
    const winCondition = 1 + (match.best_of / 2 >> 0);

    const [participant1, participant2] = challongeMatch.player1_id == getId(participants[0]) ? participants : participants.reverse();
    if (match.wbd) {
      console.log('WBD', match.wbd);
      await got.put(`${baseUrl}/matches/${challongeMatch.id}.json`, {
        json: {
          match: {
            scores_csv: match.wbd == participant1.misc ? `${winCondition}-0` : `0-${winCondition}`,
            winner_id: match.wbd == participant1.misc ? getId(participant1) : getId(participant2)
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
    
    if (score1 == winCondition || score2 == winCondition) {
      await got.put(`${baseUrl}/matches/${challongeMatch.id}.json`, {
        json: {
          match: {
            scores_csv: `${score1}-${score2}`,
            winner_id: score1 == winCondition ? getId(participant1) : getId(participant2)
          }
        }
      });
      // Clean up conditional matches
      if (match.dependents) {
        const { rows: deleted } = await pool.query(`delete from matches where $1 = any(regexp_split_to_array(dependencies, ',')) and id in (
          select matches_id from matches_players where players_id = $2
        ) returning id`, [
          match.id,
          score1 == winCondition ? participant2.misc : participant1.misc
        ]);
        // Cascade manually
        await pool.query(`delete from matches_players where matches_id = any($1)`, deleted.map(m => m.id));
        console.log('Deleted', deleted);
      }
    }
  }
  pool.end();
})();
