const got = require("got");

module.exports = function registerHook({ database }) {
  return {
    "items.update": async function ({ collection, payload, item }) {
      if (collection != "qualifier_lobbies") return;
      if (!payload.link) return;
      const webhooks = await database.select("name", "url").from("webhooks").where("name", "match");
      const players = await database.select("username").from("players").where("qualifier", item);
      for (const webhook of webhooks) {
        await got.post(webhook.url, {
          json: {
            content: null,
            embeds: [
              {
                title: `Qualifiers Lobby ${item}`,
                description: players.map(p => p.username).join('\n'),
                url: payload.link,
                color: null,
                author: {
                  name: "Mania Beginner's Showdown 3",
                  url: "https://mbs3.fightthe.pw/#/qualifiers",
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
