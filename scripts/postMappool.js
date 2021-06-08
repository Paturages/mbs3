require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  ANNOUNCEMENT_HOOK
} = process.env;

const got = require("got");
const { Pool } = require('pg');
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

const stage = 'sf';
const label = 'Semifinals';

(async () => {
  const { rows: maps } = await pool.query('select * from maps where stage = $1 order by "order"', [stage]);
  console.log(maps.length, 'maps');
  for (let i = 0; i < maps.length; i += 4) {
    const res = await got.post(ANNOUNCEMENT_HOOK, {
      json: {
        "content": i ? null : ("**" + label + "**"),
        "embeds": maps.slice(i, i+4).map(map => {
          let color;
          if (map.category.toLowerCase().includes('tiebreaker')) {
            color = 0x880e4f;
          } else if (map.category.toLowerCase().match(/rice|tech/)) {
            color = 0x2196f3;
          } else if (map.category.toLowerCase().includes('ln')) {
            color = 0xf44336;
          } else if (map.category.toLowerCase().includes('hybrid')) {
            color = 0xffeb3b;
          }
  
          return {
            color,
            fields: [
              {
                name: "Mapset by",
                value: map.charter,
                inline: true
              },
              {
                name: `⭐ ${map.sr} ⏰ ${map.length} 🎵 ${map.bpm} BPM`,
                value: `🎯 OD ${map.od} ❤️ HP ${map.hp} ⚖️ Weight ${map.weight}`,
                inline: true
              }
            ],
            author: {
              name: `[${map.category}] ${map.artist} - ${map.name} [${map.difficulty}]`,
              url: `https://osu.ppy.sh/beatmaps/${map.id}`
            },
            footer: {
              text: `!mp map ${map.id} 3`
            }
          };
        })
      }
    }).catch(err => console.log(err.body));
  }
})();
