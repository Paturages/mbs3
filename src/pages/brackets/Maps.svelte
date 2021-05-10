<script lang="ts">
  import Map from '../../components/molecules/Map.svelte';
  import ScoreRow from '../../components/molecules/ScoreRow.svelte';
  import { players } from '../../stores/core';
  import { mapRanking, init } from '../../stores/tournament/scores';

  export let stage: string;

  let hiddenMaps = {};
  const toggleHidden = map => {
    hiddenMaps = {
      ...hiddenMaps,
      [map.id]: !hiddenMaps[map.id]
    }
  }

  $: if (!$mapRanking && $players) init(stage, $players);
</script>

<div class="links">
  {#if stage == 'groups'}
    <a href="#/groups">Groups matches</a>
    <a href="#/groups!results">Groups results</a>
  {:else}
    <a href={`#/${stage}`}>Matches</a>
  {/if}
  <a href={`#/${stage}!rolls`}>Roll leaderboard</a>
</div>
{#if !$mapRanking}
  <p class="lobbies">Loading scores...</p>
{:else}
  <p class="maps">
  {#each $mapRanking as map (map.id)}
    <Map {map} />
    <div class="protects">
      <b>{map.protects.length}</b> protects: {map.protects.map(b => b.player.username).join(', ')}<br />
    </div>
    <div class="bans">
      <b>{map.bans.length}</b> bans: {map.bans.map(b => b.player.username).join(', ')}
    </div>
    <br />
    <a href="javascript:void(0)" on:click={() => toggleHidden(map)}>
      {hiddenMaps[map.id] ? 'Show' : 'Hide'} scores
    </a>
    {#if !hiddenMaps[map.id]}
      {#each Array.from(map.players.values()) as player (player.id)}
        <ScoreRow {player} score={player.mapScores.get(map.id)[0]} />
      {/each}
    {/if}
  {/each}
  </p>
{/if}

<style>
  .maps {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1em;
  }
  .maps :global(.map) {
    margin: 1em 0;
  }
  .links {
    font-size: 1.25em;
    display: flex;
    width: 30em;
    justify-content: space-between;
    margin: auto;
  }
  .protects, .bans {
    width: 70em;
    margin: .5em 0;
    font-size: .8em;
  }
</style>