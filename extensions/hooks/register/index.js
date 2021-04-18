const got = require("got");

module.exports = function registerHook({ database, env, exceptions }) {
  const { InvalidPayloadException } = exceptions;
  const { OAUTH_OSU_KEY, OAUTH_OSU_SECRET } = env;
  return {
    "items.create.before": async function (input, { collection, accountability }) {
      if (collection !== "players") return input;
      // Force registration to be current user
      const [currentUser] = await database.select('email as id').from('directus_users').where('id', accountability.user);
      // const currentUser = input;
      
      const {
        body: { access_token },
      } = await got.post("https://osu.ppy.sh/oauth/token", {
        json: {
          client_id: OAUTH_OSU_KEY,
          client_secret: OAUTH_OSU_SECRET,
          grant_type: "client_credentials",
          scope: "public",
        },
        responseType: "json",
      });
      const { body: user } = await got(
        `https://osu.ppy.sh/api/v2/users/${currentUser.id}/mania`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: "json",
        }
      );
      const rankStatus = user.statistics.variants.find(
        (v) => v.variant === "4k"
      );

      // Deny people outside rank range
      const { global_rank, pp } = rankStatus;
      if (global_rank > 40000) {
        throw new InvalidPayloadException(`4K Rank = ${global_rank}: Your rank is too low! Farm a little bit more and try again!`);
      }
      if (pp > 4750) {
        throw new InvalidPayloadException(`4K Rank = ${global_rank}, pp = ${pp}: Sorry, you farmed a little bit too much (cutoff = 4750pp)! Try to let your rank decay and try again!`);
      }

      Object.assign(input, {
        username: user.username,
        country: user.country.name,
        avatar: user.avatar_url,
        ranking: rankStatus.global_rank,
        pp: rankStatus.pp,
      });
      return input;
    },
    "items.create": async function ({ collection, payload }) {
      if (collection !== "players") return input;
      const webhooks = await database.select("name", "url").from("webhooks");
      for (const webhook of webhooks) {
        for (const item of payload) {
          await got.post(webhook.url, {
            json: {
              content: null,
              embeds: [
                {
                  title: "Registration complete!",
                  color: 0xc8e6c9,
                  fields: [
                    {
                      name: "Country",
                      value: item.country,
                      inline: true,
                    },
                    {
                      name: "Timezone",
                      value: item.timezone,
                      inline: true,
                    },
                    {
                      name: "4K Ranking",
                      value: String(item.ranking),
                    },
                    {
                      name: "4K pp",
                      value: String(item.pp),
                    },
                  ],
                  author: {
                    name: item.username,
                    url: `https://osu.ppy.sh/users/${item.id}`,
                    icon_url: item.avatar,
                  },
                },
              ],
            }
          });
        }
      }
    },
  };
};
