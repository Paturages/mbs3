const got = require("got");

const formatPoints = (points, stage) => points == stage.winCondition || points == 'WBD' ? `[__    ${points}    __]` : `[    ${points}    ]`;
const markIf = (char, txt, condition) => condition ? `${char}${char}${txt}${char}${char}` : txt;
const nullIfEmpty = arr => arr.length ? arr : null;

const getDiscordPayload = ({
  stage,
  match,
  players,
  rolls,
  protects,
  bans,
  picks
}) => ({
  content: null,
  embeds: [
    {
      title: `${formatPoints(match.points1, stage)}     -     ${formatPoints(match.points2, stage)}`,
      description: `**${players[0].username}** (#${players[0].seed}) vs **${players[1].username}** (#${players[1].seed})`,
      color: match.points1 == stage.winCondition || match.points2 == stage.winCondition || match.wbd ? 1430805 : null,
      fields: nullIfEmpty([
        rolls.length && {
          name: "Rolls",
          value: `${markIf('*', rolls[0].value, rolls[0].value > rolls[1].value)} vs. ${markIf('*', rolls[1].value, rolls[1].value > rolls[0].value)}`,
        },
        protects.length && {
          name: "Protects",
          value: protects.map((protect, i) => `${players[i].username}: **[${protect.category}] ${protect.name}**`).join('\n')
        },
        bans.length && {
          name: "Bans",
          value: bans.map((ban, i) => `${players[i].username}: **[${ban.category}] ${ban.name}**`).join('\n')
        },
        picks.length && {
          name: "Picks",
          value: picks.map(pick =>
            `**[${pick.category}] ${pick.name}**` + (
              pick.score1
                ? `\n${markIf('_', pick.score1, pick.score1 > pick.score2)} - ${markIf('_', pick.score2, pick.score2 > pick.score1)}`
                : ''
            )
          ).join('\n'),
        },
      ].filter(x => x)),
      author: {
        name: `Mania Beginner's Showdown 3: ${stage.name} M${match.id}`,
        url: match.link,
      },
      footer: {
        text: match.link ? `${match.link} - Link available in header as well!` : null,
      },
      thumbnail: {
        url: "https://mbs3.fightthe.pw/images/logo.png",
      },
    },
  ],
});

exports.sendDiscordEmbedFromMatchId = async (matchId, database) => {
  let stage, match, players, rolls = [], protects = [], bans = [], picks = [], scores = [];
  [match] = await database('matches').select('id', 'link', 'stage', 'discord_message_id', 'wbd').where('id', matchId);
  [stage] = await database('stages').select('slug', 'name', 'best_of').where('slug', match.stage);
  players = await database("matches_players")
    .join("players", "players.id", "matches_players.players_id")
    .select("players.id", "players.username", "players.group", "players.seed")
    .where("matches_players.matches_id", matchId);
  if (players[0].seed > players[1].seed) players = players.reverse();
  rolls = await database('rolls').select('value', 'player').where('match', matchId);
  if (rolls.length && rolls[0].player != players[0].id) rolls = rolls.reverse();
  protects = await database('protects')
    .join('maps', 'maps.id', 'protects.map')
    .select('protects.player', 'maps.name', 'maps.category')
    .where('protects.match', matchId);
  if (protects.length && protects[0].player != players[0].id) protects = protects.reverse();
  bans = await database('bans')
    .join('maps', 'maps.id', 'bans.map')
    .select('bans.player', 'maps.name', 'maps.category')
    .where('bans.match', matchId);
  if (bans.length && bans[0].player != players[0].id) bans = bans.reverse();
  picks = await database('picks')
    .join('maps', 'maps.id', 'picks.map')
    .select('maps.id', 'maps.name', 'maps.category')
    .where('picks.match', matchId);
  scores = await database('scores')
    .select('map', 'player', 'score')
    .where('match', matchId);

  stage.winCondition = 1 + (stage.best_of / 2 >> 0);
  match.points1 = match.wbd == players[0].id ? 'WBD' : 0;
  match.points2 = match.wbd == players[1].id ? 'WBD' : 0;
  picks.forEach(pick => {
    const score1 = scores.find(s => s.map == pick.id && s.player == players[0].id);
    const score2 = scores.find(s => s.map == pick.id && s.player == players[1].id);
    if (score1 || score2) {
      pick.score1 = (score1 || {}).score || 0;
      pick.score2 = (score2 || {}).score || 0;
      if (pick.score1 > pick.score2) {
        match.points1 += 1;
      } else {
        match.points2 += 1;
      }
    }
  });

  const [webhook] = await database
    .select("name", "url")
    .from("webhooks")
    .where("name", "match");

  if (match.discord_message_id) {
    await got.patch(`${webhook.url}/messages/${match.discord_message_id}`, {
      json: getDiscordPayload({ stage, match, players, rolls, protects, bans, picks, scores })
    });
  } else {
    const { body } = await got.post(`${webhook.url}?wait=true`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      responseType: "json",
      json: getDiscordPayload({ stage, match, players, rolls, protects, bans, picks, scores })
    });
    await database('matches').where('id', matchId).update({ discord_message_id: body.id }, ['id']);
  }
}