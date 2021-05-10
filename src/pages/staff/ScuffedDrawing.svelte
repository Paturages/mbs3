<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '../../components/atoms/Button.svelte';
  import QualifierPlayer from '../../components/molecules/QualifierPlayer.svelte';
  import { players } from '../../stores/core';
  import {
    regularMapRanking,
    regularPlayerRanking,
    init
  } from '../../stores/qualifiers/scores';

  let groups = new Array(32).fill(0).map(() => [{ id: '', username: '-' }, { id: '', username: '-' }, { id: '', username: '-' }, { id: '', username: '-' }]);
  let selectedPlayers = new Set();
  let spotlight;
  let currentGroup = 0;

  $: if (!$regularPlayerRanking && $players) init($players);
  $: seeds = $regularPlayerRanking ? [
    $regularPlayerRanking.slice(0, 32).filter(p => !selectedPlayers.has(p.id)),
    $regularPlayerRanking.slice(32, 64).filter(p => !selectedPlayers.has(p.id)),
    $regularPlayerRanking.slice(64, 96).filter(p => !selectedPlayers.has(p.id)),
    $regularPlayerRanking.slice(96, 128).filter(p => !selectedPlayers.has(p.id)),
  ] : [];

  const roll = () => {
    const seed = seeds.find(s => s.length);
    const player = seed[Math.random() * seed.length >> 0];
    spotlight = player;
    selectedPlayers = new Set([...selectedPlayers, player.id]);
    groups[currentGroup][groups[currentGroup].findIndex(x => x.username == '-')] = { id: player.id, username: player.username };
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('selectedPlayers', JSON.stringify(Array.from(selectedPlayers.values())));
    currentGroup = currentGroup == 31 ? 0 : currentGroup + 1;
  }

  const removePlayer = (i, j) => {
    selectedPlayers.delete(groups[i][j].id);
    selectedPlayers = new Set([...selectedPlayers]);
    groups[i][j] = { id: '', username: '-' };
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('selectedPlayers', JSON.stringify(Array.from(selectedPlayers.values())));
  }

  onMount(() => {
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      groups = JSON.parse(storedGroups);
    }
    const storedPlayers = localStorage.getItem('selectedPlayers');
    if (storedPlayers) {
      const players = JSON.parse(storedPlayers);
      players.forEach(p => selectedPlayers.add(p));
    }
  });
</script>

<div class="groups">
  {#each groups as group, i}
    <div class="group" class:active={currentGroup == i}>
      <h3>Group {i+1}</h3>
      {#each group as player, j}
        <div class="player">{player.username}</div>
      {/each}
    </div>
  {/each}
</div>

<div class="spotlight">
  Current group: <b>Group {currentGroup+1}</b>
  {#if spotlight}
    <QualifierPlayer position={spotlight.position} player={spotlight} maps={$regularMapRanking} />
  {/if}
  <Button on:click={roll}>Roll</Button>
</div>

<div class="seeds">
  {#each seeds as seed, i}
    <div class="seed">
      <h3>{['Top', 'High', 'Low', 'Bottom'][i]} seed</h3>
      {#each seed as player (player.id)}
        <img alt="" src={player.avatar} />
      {/each}
    </div>
  {/each}
</div>

<button on:click={() => { localStorage.clear() }}>panic</button>

<style>
  img {
    width: 2em;
    border-radius: 50%;
    border: 2px solid #eee;
    background: #fff;
  }
  .groups {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }
  .seeds {
    display: flex;
    justify-content: center;
  }
  .group {
    text-align: center;
    margin: .5em;
    width: 8em;
    font-size: 0.8em;
    white-space: nowrap;
  }
  .group.active {
    transform: scale(1.25);
  }
  .seed {
    text-align: center;
    border: 2px solid #bf360c;
    margin: 5em;
    width: 20em;
  }

  .spotlight {
    margin: auto;
    width: 50em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>