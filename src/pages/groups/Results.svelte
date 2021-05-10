<script lang="ts">
  import { results, init } from '../../stores/groups/results';
  if (!$results) init();
</script>

<div class="links">
  <a href="#/groups">Groups matches</a>
  <a href="#/groups!maps">Rankings per map</a>
  <a href="#/groups!rolls">Roll leaderboard</a>
</div>

{#if !$results}
  Loading groups results...
{:else}
  <div class="row header">
    <div class="group">Group</div>
    <div class="player">Player</div>
    <div class="cell">Victories</div>
    <div class="points">pts won - pts lost</div>
    <div class="cell">WBDs</div>
    <div class="cell">LBDs</div>
    <div class="cell">Seed</div>
  </div>
  {#each $results as row, i}
    <div class="row">
      {#if row.qualified}<div class="qualified">⭐</div>{/if}
      <div class="group">G{row.group}</div>
      <div class="player">
        <a href={`https://osu.ppy.sh/users/${row.id}`} target="_blank" rel="noopener">
          {row.username}
        </a>
      </div>
      <div class="cell">
        {row.victories}
      </div>
      <div class="points">
        {row.points_won} - {row.points_lost} = {row.won_minus_lost}
      </div>
      <div class="cell">
        {row.wbds}
      </div>
      <div class="cell">
        {row.lbds}
      </div>
      <div class="cell">
        {row.seed}
      </div>
    </div>
    {#if $results[i+1] && $results[i+1].group != row.group}
    <div class="spacer" />
    <div class="row header">
      <div class="group">Group</div>
      <div class="player">Player</div>
      <div class="cell">Victories</div>
      <div class="points">pts won - pts lost</div>
      <div class="cell">WBDs</div>
      <div class="cell">LBDs</div>
      <div class="cell">Seed</div>
    </div>
    {/if}
  {/each}
{/if}

<style>
  .row {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffd08180;
    padding: .25em;
  }
  .qualified {
    position: absolute;
    top: 0;
    left: calc(50% - 25em);
  }
  .header {
    font-weight: bold;
  }
  .row:nth-child(2n) {
    background: #ffd081c0;
  }
  .group {
    width: 3em;
  }
  .player {
    width: 10em;
  }
  .cell {
    width: 5em;
  }
  .points {
    width: 12em;
  }
  .spacer {
    height: 2em;
  }
  .links {
    font-size: 1.25em;
    display: flex;
    width: 30em;
    justify-content: space-between;
    margin: 0 auto 1em;
  }
</style>