module.exports = function registerEndpoint(router, { database, exceptions }) {
  const { ForbiddenException } = exceptions;

	router.patch('/timezone', async (req, res) => {
    if (!req.accountability || !req.accountability.user) {
      res.status(403);
      return res.send({ errors: [{ message: "Please log in first!" }] });
    }
    const [currentUser] = await database.select('email as id').from('directus_users').where('id', req.accountability.user);
    const hours = -req.body.offset / 60;
    const timezone = `UTC${hours >= 0 ? '+' : ''}${hours}`;

    await database('players').where('id', currentUser.id).update({ timezone });
    await database('referees').where('id', currentUser.id).update({ timezone });
    await database('commentators').where('id', currentUser.id).update({ timezone });
    await database('streamers').where('id', currentUser.id).update({ timezone });

    res.send(JSON.stringify(req.body));
  });
};
