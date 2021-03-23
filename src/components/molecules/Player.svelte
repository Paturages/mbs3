<script lang="ts">
  import type { Player } from '../../stores';
  export let player: Player;
</script>

<a class="player" href={`https://osu.ppy.sh/users/${player.id}`} target="_blank" rel="noopener">
  <div class="avatar">
    <img class="avatar" src={player.avatar} alt="" />
  </div>
  <div class="name">
    {player.username}
    <div class="country">{player.country}</div>
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
    background: #ffaa7e;
    width: 40em;
    padding: 1em 4em;
    border-radius: 1em;
    text-decoration: none;
    box-shadow: 0 0 2px #f97956;
  }
  .player:nth-child(2n) {
    background: #ffa06d;
  }
  .avatar {
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar img {
    height: 3em;
  }
  .name {
    font-size: 1.5em;
    margin: 0 1em;
    flex: 1;
  }
  .country {
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