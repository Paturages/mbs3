require("dotenv").config();

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

const { Pool } = require("pg");
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

const players = 'console.log(JSON.stringify(eliteSortedPlayers)); in stores/qualifierScores.ts and paste here';


(async () => {
  for (const player of players) {
    await pool.query("update players set seed = $1 where id = $2", [
      player.position,
      player.id,
    ]);
    console.log(player.username, player.position);
  }
})();
