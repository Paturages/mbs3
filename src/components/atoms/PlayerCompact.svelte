<script lang="ts">
  import type { Player } from '../../types';
  export let player: Player;
</script>

<a class="player" href={`https://osu.ppy.sh/users/${player.id}`} target="_blank" rel="noopener">
  <div class="avatar">
    <img class="avatar" src={player.avatar} alt="" />
  </div>
  <div class="flag">
    <img src={`https://osu.ppy.sh/images/flags/${player.country_code}.png`} alt={player.country} />
  </div>
  <div class="name">
    {player.username}
    <div class="details">#{player.seed} - {player.timezone}</div>
  </div>
</a>

<style>
  .player {
    display: flex;
    align-items: center;
  }
  .avatar {
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar img {
    height: 1.5em;
  }
  .flag {
    margin: 0 .5em;
  }
  .flag img {
    height: 1em;
  }
  .details {
    font-size: .8em;
  }
</style>