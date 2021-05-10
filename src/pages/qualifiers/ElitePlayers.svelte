<script lang="ts">
  import QualifierPlayer from '../../components/molecules/QualifierPlayer.svelte';
  import { me, players } from '../../stores/core';
  import {
    eliteMapRanking,
    elitePlayerRanking,
    myQualifier,
    init,
    initMyQualifier
  } from '../../stores/qualifiers/scores';

  $: if (!$elitePlayerRanking && $players) init($players);
  $: if (!$myQualifier && $elitePlayerRanking && $me) initMyQualifier($elitePlayerRanking, $me);
</script>

<div class="links">
  <a href="#/qualifiers!maps">Rankings per map</a>
  <a href="#/qualifiers!lobbies">Qualifier lobbies</a>
  <a href="#/qualifiers">Regular players</a>
</div>
{#if $myQualifier}
<div class="my-qualifier">
  <h1>Your placement</h1>
  <QualifierPlayer position={$myQualifier.position} player={$myQualifier} maps={$eliteMapRanking} />
</div>
{/if}
{#if !$elitePlayerRanking}
  <p class="lobbies">Loading qualifier scores...</p>
{:else}
  <div class="players">
    <h1>Elite players</h1>
  {#each $elitePlayerRanking as player, i (player.id)}
    <QualifierPlayer position={i+1} {player} maps={$eliteMapRanking} />
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