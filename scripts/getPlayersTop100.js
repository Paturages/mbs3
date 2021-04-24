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

  const { rows } = await pool.query('select * from players');
  for (const player of rows) {
    let summary = '';
    let best;
    let offset = 0;
    let ppSum = 0;
    do {
      ({ body: best } = await got(
        `https://osu.ppy.sh/api/v2/users/${player.id}/scores/best?mode=mania&limit=25&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: "json",
        }
      ));
      console.log(offset, '->', offset + best.length);
      offset += best.length;
      summary += best.map(({
        created_at,
        pp,
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
        beatmap: {
          cs,
          url,
          version
        },
        beatmapset: {
          artist,
          title,
          creator,
        }
      }) => {
        const song = `${artist} - ${title} [${version}] (${creator})`;
        const entry = `${(''+score).padStart(7)} (${(100 * accuracy).toFixed(2)}%, ${pp.toFixed(2)}pp)\t${c320} / ${c300} / ${c200} / ${c100} / ${c50} / ${c0} (${max_combo}) [${mods.join(', ') || 'No mod'}]`;
        ppSum += pp;
        if (cs != 4) return `not 4K\t\t${song} ${(100 * accuracy).toFixed(2)} ${pp.toFixed(2)}`;
        return `${created_at}\t` + song.padEnd(100) + entry;
      }).join('\n') + '\n';
      await new Promise(r => setTimeout(r, 100));
    } while (best.length);

    await fs.writeFile(path.resolve(__dirname, '..', 'best', `${String(player.ranking).padStart(5, '0')}.${player.username.replace(/[^A-z0-9_\- ]/g, '')}.txt`), `https://osu.ppy.sh/users/${player.id} ${player.username}\nSum of pp: ${ppSum}\n\n` + summary);

    await new Promise(r => setTimeout(r, 150));
  }
})();
