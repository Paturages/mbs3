<script lang="ts">
  import type { Match, Stage } from '../../types';
  export let match: Match;
  export let stage: Stage;

  const boldIf = (str: string | number, condition: boolean) => condition ? `**${str}**` : str;
  const winCondition = 1 + (stage.best_of / 2 >> 0);
</script>

<textarea readonly value={`${stage.name}: M${match.id}
${boldIf(`${match.players[0].player.username} ${match.points1}`, match.points1 == winCondition)} | ${boldIf(`${match.points2} ${match.players[1].player.username}`, match.points2 == winCondition)}
Rolls: ${match.rolls.map((roll, i) => boldIf(roll.value, roll.value > match.rolls[(i+1)%2]?.value)).join(' | ')}

Protects:
${match.protects.map(protect => `${protect.player.username}: [${protect.map.category}] ${protect.map.name}`).join('\n')}

Bans:
${match.bans.map(ban => `${ban.player.username}: [${ban.map.category}] ${ban.map.name}`).join('\n')}

MP Link: ${match.link}`}></textarea>

<style>
  textarea {
    height: 20em;
    width: 40em;
  }
</style>