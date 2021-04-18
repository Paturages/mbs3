require('dotenv').config();

const {
  OAUTH_OSU_KEY,
  OAUTH_OSU_SECRET
} = process.env;

const got = require("got");
const beatmapId = '2658672';

(async () => {
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
  
  const { body: map } = await got(
    `https://osu.ppy.sh/api/v2/beatmaps/${beatmapId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      responseType: "json",
    }
  );

  console.log(map);
})();
