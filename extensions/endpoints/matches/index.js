const got = require('got');

module.exports = function registerEndpoint(router, { database, env }) {
  const { OSU_V1_KEY } = env;
	router.post('/scores', async (req, res) => {
    if (!req.accountability || !req.accountability.user) {
      res.status(403);
      return res.send({ errors: [{ message: "Please log in first!" }] });
    }
    const [currentUser] = await database.select('email as id').from('directus_users').where('id', req.accountability.user);
    const [referee] = await database.select('id').from('referees').where('id', currentUser.id);

    if (!referee) {
      res.status(403);
      return res.send({ errors: [{ message: "Only for referees!" }] });
    }

    const { match: matchId, map: mapId } = req.body;
    const [match] = await database.select('link', 'stage').from('matches').where('id', matchId);

    if (!match) {
      res.status(404);
      return res.send({ errors: [{ message: "Match not found" }] });
    }

    const players = await database.select('players_id').from('matches_players').where('matches_id', matchId);

    const { body } = await got(`https://osu.ppy.sh/api/get_match`, {
      responseType: "json",
      searchParams: {
        k: OSU_V1_KEY,
        mp: match.link.split('/').pop(),
        // mp: 81319237
      },
    });

    let mockPlayer = 0;
    for (const game of body.games) {
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
        // Existence check
        if (!players.find(p => p.players_id == user_id)) continue;
        if (mapId != game.beatmap_id) continue;

        // if (mockPlayer == 1) break;

        await database('scores').insert({
          user_created: req.accountability.user,
          date_created: new Date(),

          player: user_id,
          map: game.beatmap_id,
          // player: players[mockPlayer].players_id,
          // map: mapId,

          match: matchId,
          score,
          combo: maxcombo,
          c320: countgeki,
          c300: count300,
          c200: countkatu,
          c100: count100,
          c50: count50,
          c0: countmiss
        }).onConflict(['match', 'player', 'map']).merge();

        // mockPlayer = 1;
      }
    }

    const scores = await database.select().from('scores').where('match', matchId);

    res.send(
      JSON.stringify(
        scores.map(score => ({
          ...score,
          player: { id: score.player },
          map: { id: score.map }
        }))
      )
    );
  });
};
