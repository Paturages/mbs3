<script lang="ts">
  import Map from '../components/molecules/Map.svelte';
  import { qualifierLobbies, qualifierMaps, init } from '../stores/qualifierLobbies';

  if (!$qualifierLobbies) init();
</script>

{#if !$qualifierLobbies}
  <p class="lobbies">Loading stage...</p>
{:else}
  <p class="maps">
  {#each $qualifierMaps as map (map.id)}
    <Map {map} />
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
    margin: .25em 0;
  }
</style>