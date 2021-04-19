module.exports = function registerEndpoint(router, { database }) {
	router.post('/schedule', async (req, res) => {
    if (!req.accountability || !req.accountability.user) {
      res.status(403);
      return res.send({ errors: [{ message: "Please log in first!" }] });
    }
    const [currentUser] = await database.select('email as id').from('directus_users').where('id', req.accountability.user);
    const { qualifier } = req.body;
    const players = await database.select('id').from('players').where('qualifier', qualifier);
    if (players.length > 8) {
      res.status(403);
      return res.send({ errors: [{ message: 'There are already 8 players in this lobby! If you absolutely cannot make any other time, please reach out in #reschedules.' }] });
    }
    const [player] = await database('players').where('id', currentUser.id).update({ qualifier }, ['id']);
    if (!player) {
      res.status(403);
      return res.send({ errors: [{ message: "Wait... you're not a player, how did you get here?" }] });
    }
    res.send(JSON.stringify(req.body));
  });
};
