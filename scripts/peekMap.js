require('dotenv').config();

const {
  OAUTH_OSU_KEY,
  OAUTH_OSU_SECRET
} = process.env;

const got = require("got");
const beatmapId = '3526592';
const userId = '1375479';

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
  
  const { body } = await got(
    `https://osu.ppy.sh/api/v2/beatmapsets/1128610`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      responseType: "json",
    }
  );

  console.log(JSON.stringify(body, null, 2));
})();
