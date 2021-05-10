<script lang="ts">
  import QualifierPlayer from '../../components/molecules/QualifierPlayer.svelte';
  import { me, players } from '../../stores/core';
  import {
    regularMapRanking,
    regularPlayerRanking,
    myQualifier,
    init,
    initMyQualifier
  } from '../../stores/qualifiers/scores';

  $: if (!$regularPlayerRanking && $players) init($players);
  $: if (!$myQualifier && $regularPlayerRanking && $me) initMyQualifier($regularPlayerRanking, $me);
</script>

<div class="links">
  <a href="#/qualifiers!maps">Rankings per map</a>
  <a href="#/qualifiers!lobbies">Qualifier lobbies</a>
  <a href="#/qualifiers!elite">Elite players</a>
</div>
{#if $myQualifier}
<div class="my-qualifier">
  <h1>Your placement</h1>
  <QualifierPlayer position={$myQualifier.position} player={$myQualifier} maps={$regularMapRanking} />
</div>
{/if}
{#if !$regularPlayerRanking}
  <p class="lobbies">Loading qualifier scores...</p>
{:else}
  <div class="players">
  {#each $regularPlayerRanking as player, i (player.id)}
    {#if i == 0}
      <h1>Top seed</h1>
    {:else if i == 32}
      <h1>High seed</h1>
    {:else if i == 64}
      <h1>Low seed</h1>
    {:else if i == 96}
      <h1>Bottom seed</h1>
    {:else if i == 128}
      <h1>Not qualified</h1>
    {/if}
    <QualifierPlayer position={i+1} {player} maps={$regularMapRanking} />
  {/each}
  </div>
{/if}

<style>
  .my-qualifier, .players {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .players :global(.scores) {
    margin-bottom: .5em;
  }
  .links {
    font-size: 1.25em;
    display: flex;
    width: 30em;
    justify-content: space-between;
    margin: auto;
  }
</style>