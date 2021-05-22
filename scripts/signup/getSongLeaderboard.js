require('dotenv').config();

const {
  OAUTH_OSU_KEY,
  OAUTH_OSU_SECRET,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
} = process.env;

const fs = require("fs").promises;
const path = require("path");
const got = require("got");
const { Pool } = require('pg');
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

const songLink = process.argv[2];
if (!songLink) throw new Error('Please provide a map link');

(async () => {
  const mapId = songLink.split('/').pop();
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

  const { rows } = await pool.query('select * from players');
  const scores = [];
  for (const player of rows) {
    const { body: entry } = await got(
      `https://osu.ppy.sh/api/v2/beatmaps/${mapId}/scores/users/${player.id}?mode=mania`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        responseType: "json",
      }
    ).catch(() => ({}));
    if (entry) scores.push(entry);
    if (entry) {
      const {
        score: {
          score,
          accuracy,
          max_combo,
          mods,
          statistics: {
            count_50: c50,
            count_100: c100,
            count_300: c300,
            count_geki: c320,
            count_katu: c200,
            count_miss: c0
          },
          user: { username }
        }
      } = entry;
      console.log(username, score, `(${(100 * accuracy).toFixed(2)}%, ${max_combo} combo, ${mods.join(', ') || 'No mod'})`, c320, c300, c200, c100, c50, c0);
    }
    await new Promise(r => setTimeout(r, 50));
  }
  const content = songLink + '\n\n' + scores.sort((a, b) => a.score.score < b.score.score ? 1 : -1)
    .map(entry => {
      const {
        score: {
          created_at,
          score,
          accuracy,
          max_combo,
          mods,
          statistics: {
            count_50: c50,
            count_100: c100,
            count_300: c300,
            count_geki: c320,
            count_katu: c200,
            count_miss: c0
          },
          user: { username, id: user_id }
        }
      } = entry;
      const display = `${score} (${(100 * accuracy).toFixed(2)}%)   ${
        String(c320).padStart(4)
      } / ${
        String(c300).padStart(4)
      } / ${
        String(c200).padStart(4)
      } / ${
        String(c100).padStart(4)
      } / ${
        String(c50).padStart(4)
      } / ${
        String(c0).padStart(4)
      } (${max_combo}) [${mods.join(', ') || 'No mod'}]`;
      return `${created_at}\t${user_id}\t${username.padEnd(40)}` + display;
    }).join('\n');
  
  await fs.writeFile(path.resolve(__dirname, '..', 'scores', `${mapId}.txt`), content);
})();