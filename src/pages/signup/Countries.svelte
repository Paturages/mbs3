<script lang="ts">
  import type { Player as IPlayer } from '../../types';
  import Player from '../../components/molecules/Player.svelte';
  import { players } from '../../stores/core';

  $: countries = Object.values(
    ($players?.reduce((obj, player) => {
      if (!obj[player.country]) obj[player.country] = { country: player.country, players: [], aliveCount: 0 };
      obj[player.country].players.push(player);
      if (player.alive) obj[player.country].aliveCount += 1;
      return obj;
    }, {}) || {}) as Record<string, { country: string, players: IPlayer[] }>
  ).sort((a, b) => a.players.length < b.players.length ? 1 : -1);

  let selectedCountry: string;
  const selectCountry = (country: string) => (selectedCountry = selectedCountry == country ? null : country);
</script>

<div class="countries">
  {#each countries as { players, country, aliveCount } (country)}
    <div class="country" on:click={() => selectCountry(country)}>
      <div class="label">
        {country}: {players.length} player{players.length == 1 ? '' : 's'}
        {#if aliveCount}
          ({aliveCount} alive)
        {/if}
      </div>
      <div class="pointer">{selectedCountry == country ? '▼' : '►'}</div>
    </div>
    {#if selectedCountry == country}
    <div class="players">
      {#each players as player}
        <Player {player} />
      {/each}
    </div>
    {/if}
  {:else}
    Loading...
  {/each}
</div>

<style>
  .countries {
    text-align: center;
  }
  .country {
    cursor: pointer;
    text-align: left;
    margin: 1em auto;
    width: 40em;
    padding: 1em 4em;
    border-radius: 1em;
    background: #ffd08180;
    box-shadow: 0 0 2px #ffd081;
    display: flex;
    align-items: center;
  }
  .country:nth-child(2n) {
    background: #ffd081c0;
  }
  .label {
    flex: 1;
  }
  .players :global(.player) {
    margin: .5em auto;
  }
</style>