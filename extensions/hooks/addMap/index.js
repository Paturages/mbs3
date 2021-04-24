const got = require("got");

module.exports = function registerHook({ env }) {
  const { OAUTH_OSU_KEY, OAUTH_OSU_SECRET } = env;
  return {
    "items.create.before": async function (input, { collection }) {
      if (collection != "maps") return input;

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
      input.id = input.id.split('/').pop();
      const { body: map } = await got(
        `https://osu.ppy.sh/api/v2/beatmaps/${input.id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: "json",
        }
      );
      const humanLength = `${Math.floor(map.total_length / 60)}:${String(map.total_length % 60).padStart(2, '0')}`;
      const humanDrainLength = `${Math.floor(map.hit_length / 60)}:${String(map.hit_length % 60).padStart(2, '0')}`;
      const length = `${humanLength} (${humanDrainLength})`;

      Object.assign(input, {
        artist: map.beatmapset.artist,
        name: map.beatmapset.title,
        difficulty: map.version,
        charter: map.beatmapset.creator,
        charter_id: map.beatmapset.user_id,
        bpm: map.bpm,
        length,
        od: map.accuracy,
        hp: map.drain,
        sr: map.difficulty_rating,
        rice: map.count_circles,
        ln: map.count_sliders,
        cover: map.beatmapset.covers.cover
      });

      return input;
    }
  };
};
