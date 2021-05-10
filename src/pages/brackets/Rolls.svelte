<script lang="ts">
  import { rolls, init } from '../../stores/tournament/rolls';
  export let stage: string;

  if (!$rolls) init(stage);
</script>

<div class="links">
  {#if stage == 'groups'}
    <a href="#/groups">Groups matches</a>
    <a href="#/groups!results">Groups results</a>
  {:else}
    <a href={`#/${stage}`}>Matches</a>
  {/if}
  <a href={`#/${stage}!maps`}>Rankings per map</a>
</div>

{#if !$rolls}
  Loading rolls...
{:else}
  <div class="row header">
    <div class="player">Player</div>
    <div class="cell">Roll</div>
  </div>
  {#each $rolls as roll}
    <div class="row">
      <div class="player">
        <a href={`https://osu.ppy.sh/users/${roll.player.id}`} target="_blank" rel="noopener">
          {roll.player.username}
        </a>
      </div>
      <div class="cell">
        {roll.value}
      </div>
    </div>
  {/each}
{/if}

<style>
  .row {
    width: 30em;
    margin: auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffd08180;
    padding: .25em;
  }
  .header {
    font-weight: bold;
  }
  .row:nth-child(2n) {
    background: #ffd081c0;
  }
  .player {
    width: 10em;
  }
  .cell {
    width: 5em;
  }
  .links {
    font-size: 1.25em;
    display: flex;
    width: 30em;
    justify-content: space-between;
    margin: 0 auto 1em;
  }
</style>