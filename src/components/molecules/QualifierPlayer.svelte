<script lang="ts">
  import type { Map } from '../../types';
  import type { QualifierPlayer } from '../../stores/qualifierScores';
  export let position: number;
  export let player: QualifierPlayer;
  export let maps: Map[];
</script>

<a class="player" href={`https://osu.ppy.sh/users/${player.id}`} target="_blank" rel="noopener">
  <div class="avatar">
    <img class="avatar" src={player.avatar} alt="" />
  </div>
  <div class="name">
    {position}. {player.username} (#{player.ranking})
    <div class="country">{player.country}</div>
  </div>
  <div class="positions">
    {maps.map(map => player.mapScores.get(map.id)[0]?.position || 'N/A').join(' + ')}
    =
    <b>{player.sumOfPositions}</b>
    <div class="total-score">
      Total score: {player.totalScore}
    </div>
  </div>
</a>
<div class="scores">
  {#each maps as map (map.id)}
    <div class="score">
      {player.mapScores.get(map.id)[0]?.score || 'N/A'}<br />
      ({player.mapScores.get(map.id)[0]?.position || '-'})
    </div>
  {/each}
</div>

<style>
  .player {
    display: flex;
    align-items: center;
    background: #ffd08180;
    width: 50em;
    padding: 0 1em;
    border-radius: 1em;
    text-decoration: none;
    box-shadow: 0 0 2px #ffd081;
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
  .positions {
    margin: 0 1em;
    text-align: right;
  }
  .total-score {
    font-size: .8em;
  }
  .scores {
    width: 25em;
    display: flex;
    justify-content: space-between;
    background: #ffd08180;
    padding: .25em 1em;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
  .score {
    text-align: center;
  }
</style>