require("dotenv").config();

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;
const { Pool } = require("pg");
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

const Ruleset = {
  ID: 3,
  Name: "osu!mania",
  ShortName: "mania",
  InstantiationInfo:
    "osu.Game.Rulesets.Mania.ManiaRuleset, osu.Game.Rulesets.Mania",
};

const getLengthFromString = (str) => {
  const [, drain] = str.split(" ");
  const [minutes, seconds] = drain.slice(1, -1).split(":");
  return 60000 * minutes + 1000 * seconds;
};

const BRACKET = {
  MATCH_WIDTH: 250,
  MATCH_HEIGHT: 100,
};

// Usage: node scripts/bracket/generateLazerBracket.js > "C:\Users\Paturages\AppData\Roaming\osu\tournaments\mbs3\bracket.json"
(async () => {
  const { rows: stages } = await pool.query(`select * from stages where best_of is not null`);
  const { rows: maps } = await pool.query(`select * from maps order by "order"`);
  const { rows: matches } = await pool.query(`select * from matches where stage != 'groups'`);
  const { rows: matchesPlayers } = await pool.query(`select * from matches_players`);
  const { rows: players } = await pool.query(`select * from players where seed is not null`);
  const { rows: scores } = await pool.query(`select * from scores`);

  const stagesMap = new Map(stages.map((stage) => [stage.slug, stage]));
  maps.forEach((map) => {
    const stage = stagesMap.get(map.stage);
    if (!stage) return;
    if (!stage.maps) stage.maps = [];
    stage.maps.push(map);
  });
  const playersMap = new Map(players.map((player) => [player.id, player]));
  const matchesMap = new Map(matches.map((match) => [match.id, match]));

  scores.forEach((score) => {
    const match = matchesMap.get(score.match);
    if (!match) return;
    if (!match.picks) match.picks = {};
    if (!match.picks[score.map]) match.picks[score.map] = {};
    match.picks[score.map][score.player] = score;
  });

  matchesPlayers.forEach(({ matches_id, players_id }) => {
    const match = matchesMap.get(matches_id);
    const player = playersMap.get(players_id);
    if (!match || !player) return;

    // Use the group index to align matches from the same group
    match.groupIndex = +player.group;

    // Properly align players as "higher seed" vs "lower seed"
    if (!match.players) {
      match.players = [player];
    } else if (player.seed < match.players[0].seed) {
      match.players.unshift(player);
    } else {
      match.players.push(player);
    }
  });

  matches.forEach((match) => {
    match.stage = stagesMap.get(match.stage);
    match.winCondition = 1 + ((match.stage.best_of / 2) >> 0);
    // Compute match scores
    if (match.wbd) {
      match.points1 = match.wbd == match.players[0].id ? match.winCondition : 0;
      match.points2 = match.wbd == match.players[1].id ? match.winCondition : 0;
    } else if (match.picks) {
      match.points1 = 0;
      match.points2 = 0;
      Object.entries(match.picks).forEach(([mapId, playerScores]) => {
        const score1 = playerScores[match.players[0].id];
        const score2 = playerScores[match.players[1].id];
        if (score1 && score2) {
          if (score1.score > score2.score) {
            match.points1 += 1;
          } else {
            match.points2 += 1;
          }
        }
      });
    }
  });

  // Sort matches by stage
  matches.sort((a, b) => {
    if (a.stage.sort != b.stage.sort) {
      return a.stage.sort - b.stage.sort;
    }
    return a.time < b.time ? -1 : 1;
  });

  let positionY = -1;
  console.log(
    JSON.stringify(
      {
        Ruleset,
        Matches: matches.map((match, i) => ({
          ID: match.id,
          Team1Acronym: match.players[0].username.toUpperCase(),
          Team1Score: match.points1,
          Team2Acronym: match.players[1].username.toUpperCase(),
          Team2Score: match.points2,
          Completed:
            match.points1 == match.winCondition ||
            match.points2 == match.winCondition,
          Losers: false,
          PicksBans: [], // we don't care about the picks/bans outside of stream for bracket.json
          Current: !i, // select the first match to at least have the schedule I guess?
          Date: match.time,
          ConditionalMatches: [],
          Position: {
            Y: BRACKET.MATCH_HEIGHT * (matches[i-1] && matches[i-1].stage != match.stage ? (positionY = 0) : ++positionY),
            X: BRACKET.MATCH_WIDTH * match.stage.sort,
          },
          Acronyms: match.players.map((p) => p.username.toUpperCase()),
          WinnerColour: match.points1 == match.winCondition ? "Red" : "Blue",
          PointsToWin: match.winCondition,
        })),
        Rounds: stages.map((stage) => ({
          Name: stage.name,
          Description: stage.name,
          BestOf: stage.best_of,
          StartDate: stage.date_start,
          Matches: matches
            .filter((match) => match.stage.slug == stage.slug)
            .map((match) => match.id),
          beatmaps:
            stage.maps?.map((map) => ({
              ID: map.id.replace(/\?/g, ''),
              Mods: map.category.split(" ")[0].toUpperCase(), // Only take the first word of "Tiebreaker (rice)"
              BeatmapInfo: {
                id: map.id.replace(/\?/g, ''),
                Status: -3,
                BeatmapSet: {
                  Status: -3,
                  Metadata: {
                    Title: map.name,
                    Artist: map.artist,
                    Creator: map.charter,
                    user_id: 1,
                  },
                  OnlineInfo: {
                    Covers: {
                      "cover@2x": map.cover,
                    },
                    bpm: map.bpm,
                  },
                },
                Metadata: {
                  Title: map.name,
                  Artist: map.artist,
                  Creator: map.charter,
                  user_id: 1,
                },
                BaseDifficulty: {
                  DrainRate: map.hp,
                  CircleSize: 4,
                  OverallDifficulty: map.od,
                  ApproachRate: 9,
                  SliderMultiplier: 1,
                  SliderTickRate: 1,
                },
                OnlineInfo: {
                  CircleCount: map.rice,
                  SliderCount: map.ln,
                },
                Length: getLengthFromString(map.length),
                Countdown: true,
                StackLeniency: 0.7,
                Ruleset,
                Bookmarks: [],
                Version: map.difficulty,
                difficulty_rating: map.sr,
                SearchableTerms: [],
              },
            })) || [],
        })),
        Teams: players.concat([
          {
            username: 'Mappool',
            country: 'Map',
            country_code: 'MAP',
            seed: 0,
          },
          {
            username: 'Showcase',
            country: 'Map',
            country_code: 'MAP',
            seed: 0,
          },
        ]).map((player) => ({
          FullName: player.username,
          FlagName: player.country_code,
          Acronym: player.username.toUpperCase(),
          SeedingResults: [],
          Seed: String(player.seed),
          LastYearPlacing: 0,
          AverageRank: 0,
          Players: [
            {
              id: player.id,
              username: player.username,
              country: {
                name: player.country,
                code: player.country_code,
              },
              Status: null,
              Activity: null,
              // we don't give a shit about stats but lazer fills it automatically if it doesn't exist and takes forever
              cover: {
                url: "https://osu.ppy.sh/images/headers/profile-covers/c3.jpg",
                id: 3,
              },
              cover_url:
                "https://osu.ppy.sh/images/headers/profile-covers/c3.jpg",
              statistics: {
                level: {
                  current: 79,
                  progress: 81,
                },
                global_rank: 14590,
                country_rank: 1801,
                pp: 4452.74,
                ranked_score: 651216786,
                hit_accuracy: 95.9422,
                play_count: 14730,
                play_time: 714206,
                total_score: 3358042219,
                total_hits: 6036172,
                maximum_combo: 3541,
                replays_watched_by_others: 6,
                grade_counts: {
                  ssh: 1,
                  ss: 6,
                  sh: 0,
                  s: 509,
                  a: 180,
                },
              },
            },
          ],
        })),
        ChromaKeyWidth: 1366,
        PlayersPerTeam: 4,
      },
      null,
      2
    )
  );
  process.exit(0);
})();
