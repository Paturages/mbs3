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
    const { body: user } = await got(
      `https://osu.ppy.sh/api/v2/users/${player.id}/mania`,
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
    console.log(player.id.padEnd(10), player.username.padEnd(20), player.ranking, '->', rankStatus.global_rank);
    await pool.query(`update players
    set date_updated = now(),
      ranking = $2,
      pp = $3,
      username = $4,
      country = $5,
      country_code = $6,
      avatar = $7
    where id = $1`, [
      player.id,
      rankStatus.global_rank,
      rankStatus.pp,
      user.username,
      user.country.name,
      user.country.code,
      user.avatar_url
    ]);
    
    let summary = await fs.readFile(path.resolve(__dirname, '..', 'profiles', `${player.username.replace(/[^A-z0-9_\- ]/g, '')}.txt`)).catch(() => {
      console.log('New player!');
      return '';
    });
    let recent;
    let offset = 0;
    do {
      ({ body: recent } = await got(
        `https://osu.ppy.sh/api/v2/users/${player.id}/scores/recent?include_fails=1&mode=mania&limit=25&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: "json",
        }
      ));
      console.log(offset, '->', offset + recent.length);
      offset += recent.length;
      summary += recent.map(({
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
          url,
          version
        },
        beatmapset: {
          artist,
          title,
          creator,
        }
      }) => {
        const song = `${url}\t${artist} - ${title} [${version}] (${creator})`;
        const entry = `${(''+score).padStart(7)} (${(100 * accuracy).toFixed(2)}%)\t${c320} / ${c300} / ${c200} / ${c100} / ${c50} / ${c0} (${max_combo}) [${mods.join(', ') || 'No mod'}]`;
        return song.padEnd(175) + entry;
      }).join('\n') + '\n';
      await new Promise(r => setTimeout(r, 100));
    } while (recent.length);

    await fs.writeFile(path.resolve(__dirname, '..', 'profiles', `${player.username.replace(/[^A-z0-9_\- ]/g, '')}.txt`), summary);

    await new Promise(r => setTimeout(r, 150));
  }
})();
