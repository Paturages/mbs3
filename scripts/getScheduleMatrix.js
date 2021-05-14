require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
} = process.env;

const { Pool } = require('pg');
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

(async () => {
  const { rows } = await pool.query(`
    select m.id, m.time, m_rf.username as ref, array_agg(rf.username) as refs
    from matches m
    left join matches_referees r on matches_id = m.id
    left join referees rf on rf.id = r.referees_id
    left join referees m_rf on m_rf.id = m.referee
    where m.stage = 'ro64'
    group by m.id, m.time, m_rf.username
    order by m.time
  `);
  
  const refs = new Set(rows.reduce((arr, { refs }) => refs[0] ? arr.concat(refs) : arr, []));
  const columns = ['', ...refs];
  const output = [columns];
  for (const row of rows) {
    output.push(
      columns.map(c => !c ? `${row.id} ${row.time}` : (~row.refs.indexOf(c) ? '| X' : '|')).concat([row.ref || ''])
    );
  }
  console.log(output.map(r => r.map((x, i) => !i ? x.padEnd(23) : x.padEnd(15)).join('')).join('\n'));
  process.exit(0);
})();
