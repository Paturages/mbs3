const got = require("got");
const uuid = require("uuid");

module.exports = function registerHook({ database, env }) {
  const { OAUTH_OSU_KEY, OAUTH_OSU_SECRET } = env;
  return {
    "items.create.before": async function (input, { collection }) {
      if (!["commentators", "referees", "streamers"].includes(collection)) return input;

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
      // If the ID is a URL, reduce that to only the ID
      input.id = input.id.split('/').filter(x => +x)[0];
      const { body: user } = await got(
        `https://osu.ppy.sh/api/v2/users/${input.id}/mania`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: "json",
        }
      );

      Object.assign(input, {
        username: user.username,
        discord: user.discord,
        country: user.country.name,
        country_code: user.country.code,
        avatar: user.avatar_url
      });

      // Add user entry to corresponding role
      const [role] = await database.select('id').from('directus_roles').where('name', {
        commentators: 'Commentator',
        referees: 'Referee',
        streamers: 'Streamer'
      }[collection]);
      await database.insert({
        id: uuid.v4(),
        email: input.id,
        first_name: user.username,
        location: user.country.name,
        role: role.id
      })
        .into('directus_users')
        .onConflict('email')
        .merge();

      return input;
    }
  };
};
