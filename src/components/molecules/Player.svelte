<script lang="ts">
  import type { Player } from '../../types';
  export let player: Player;
</script>

<a class="player" class:dead={!player.alive} href={`https://osu.ppy.sh/users/${player.id}`} target="_blank" rel="noopener">
  <div class="avatar">
    <img class="avatar" src={player.avatar} alt="" />
  </div>
  <div class="name">
    {player.username}
    <div class="country">
      <img src={`https://osu.ppy.sh/images/flags/${player.country_code}.png`} alt="" />
      {player.country}
    </div>
    <div class="stats">
      {#if player.seed}
        Seed #{player.seed}
      {/if}
      {#if player.elite}
        - Elite bracket
      {/if}
      {#if player.matches.length}
        - {player.matches[player.matches.length-1].match.stage.name}
      {/if}
    </div>
  </div>
  <div class="ranking">
    {player.ranking}
    <div class="pp">({Number(player.pp).toFixed(2)} pp)</div>
  </div>
</a>

<style>
  .player {
    display: flex;
    align-items: center;
    background: #ffd08180;
    width: 40em;
    padding: 0 4em;
    border-radius: 1em;
    text-decoration: none;
    box-shadow: 0 0 2px #ffd081;
  }
  .dead {
	  color: #bf360c50;
  }
  .player:nth-child(2n) {
    background: #ffd081c0;
  }
  .avatar {
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar img {
    height: 3em;
  }
  .name {
    text-align: center;
    font-size: 1.5em;
    margin: 0 1em;
    flex: 1;
  }
  .country {
    font-size: .5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .country img {
    height: 1.25em;
    margin-right: .5em;
  }
  .stats {
    font-size: .5em;
  }
  .ranking {
    font-size: 1.5em;
    margin: 0 1em;
    text-align: right;
  }
  .pp {
    font-size: .5em;
  }
</style>