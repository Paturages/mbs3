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

  const { rows } = await pool.query(`
    select q.name, q_rf.username as ref, array_agg(rf.username) as refs
    from qualifier_lobbies q
    left join qualifier_lobbies_referees r on qualifier_lobbies_name = q.name
    left join referees rf on rf.id = referees_id
    left join referees q_rf on q_rf.id = q.referee
    group by q.name, q_rf.username
    order by q.time
  `);
  
  const refs = new Set(rows.reduce((arr, { refs }) => refs[0] ? arr.concat(refs) : arr, []));
  const columns = ['', ...refs];
  const output = [columns];
  for (const row of rows) {
    output.push(
      columns.map(c => !c ? row.name : (~row.refs.indexOf(c) ? '| X' : '|')).concat([row.ref])
    );
  }
  console.log(output.map(r => r.map((x, i) => !i ? x.padEnd(5) : x.padEnd(15)).join('')).join('\n'));
})();
