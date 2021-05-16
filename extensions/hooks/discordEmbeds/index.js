const { sendDiscordEmbedFromMatchId } = require('../../../common/discordEmbeds');

module.exports = function registerHook({ database }) {
  return {
    "items.create": async function ({ collection, item }) {
      // On pick create and score create
      if (collection == 'picks' || collection == 'scores') {
        const [entity] = await database(collection).select('match').where('id', +item);
        await sendDiscordEmbedFromMatchId(entity.match, database);
      }
    },
    "items.update": async function ({ collection, payload, item }) {
      // On match link update
      if (collection == 'matches' && payload.link) {
        await sendDiscordEmbedFromMatchId(+item, database);
      }
    },
  };
};
