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
  const { rows: results } = await pool.query(`select
    p.id,
    p.group,
    p.username,
    count(*) filter (where p.points_won = 4 or p.wbd) as victories,
    sum(p.points_won) as points_won,
    sum(p.points_lost) as points_lost,
    sum(p.points_won - p.points_lost) as won_minus_lost,
    count(*) filter (where p.wbd) as wbds,
    count(*) filter (where p.lbd) as lbds,
    p.seed
  from (
    select
        p1.id,
        x.id as match_id,
        p1.username,
        p1.group,
        p1.seed,
        sum(case
            when s1.score > s2.score then 1
            when x.wbd = p1.id then 4
            else 0
        end) as points_won,
        sum(case
            when s1.score < s2.score then 1
            when x.wbd != p1.id then 4
            else 0
        end) as points_lost,
        x.wbd = p1.id as wbd,
        x.wbd != p1.id as lbd
    from matches x
    -- get the loser by default's player id
    left join matches_players mp on mp.matches_id = x.id and mp.players_id != x.wbd
    left join scores s1 on x.id = s1.match
    left join scores s2 on s1.match = s2.match and s1.map = s2.map and s1.player != s2.player
    left join players p1 on s1.player = p1.id or x.wbd = p1.id or mp.players_id = p1.id
    left join players p2 on s2.player = p2.id
    where p1.id is not null
    group by p1.id, x.id
  ) p
  group by p.id, p.username, p.group, p.seed
  order by p.group, victories desc, won_minus_lost desc, lbds, seed`);
  
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
})();
