const got = require("got");

module.exports = function registerHook({ database }) {
  return {
    "items.update": async function ({ collection, payload, item }) {
      if (collection != "matches") return;
      if (!payload.link) return;
      const webhooks = await database.select("name", "url").from("webhooks").where("name", "match");
      const [match] = await database('matches')
        .join('stages', 'stages.slug', 'matches.stage')
        .select('matches.id', 'stages.name', 'stages.slug')
        .where('matches.id', +item);
      let players = await database("matches_players")
        .join('players', 'players.id', 'matches_players.players_id')
        .select('players.username', 'players.group', 'players.seed')
        .where('matches_players.matches_id', +item);
      if (players[0].seed > players[1].seed) players = players.reverse();

      for (const webhook of webhooks) {
        await got.post(webhook.url, {
          json: {
            content: null,
            embeds: [
              {
                title: `${match.name} M${item}`,
                description: players.map(p => `**${p.username}** (${p.seed})`).join(' vs. '),
                url: payload.link,
                color: null,
                author: {
                  name: "Mania Beginner's Showdown 3",
                  url: `https://mbs3.fightthe.pw/#/${match.slug}`,
                },
                thumbnail: {
                  url: "https://mbs3.fightthe.pw/images/logo.png",
                },
              },
            ],
          },
        });
      }
    },
  };
};
