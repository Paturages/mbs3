<script lang="ts">
  import type { Match } from '../../types';
  export let match: Match;

  const boldIf = (str: string | number, condition: boolean) => condition ? `**${str}**` : str;

  const value = `Group Stage G${match.players[0].player.group.id}-${match.id}
${boldIf(`${match.players[0].player.username} ${match.points1}`, match.points1 == 4)} | ${boldIf(`${match.points2} ${match.players[1].player.username}`, match.points2 == 4)}
Rolls: ${match.rolls.map((roll, i) => boldIf(roll.value, roll.value > match.rolls[(i+1)%2]?.value)).join(' | ')}

Protects:
${match.protects.map(protect => `${protect.player.username}: [${protect.map.category}] ${protect.map.name}`).join('\n')}

Bans:
${match.bans.map(ban => `${ban.player.username}: [${ban.map.category}] ${ban.map.name}`).join('\n')}

MP Link: ${match.link}`;
</script>

<textarea readonly {value}></textarea>

<style>
  textarea {
    height: 20em;
    width: 40em;
  }
</style>