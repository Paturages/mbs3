<script lang="ts">
  import type { Match as IMatch } from '../../types';
  import GroupsMatch from '../../components/molecules/GroupsMatch.svelte';
  import Map from '../../components/molecules/Map.svelte';
  import { me } from '../../stores/core';
  import { groupsMatches, groupsMaps, init } from '../../stores/groups/matches';

  if (!$groupsMatches) init();

  let sortedByGroup = false;
  const sortByGroup = () => {
    sortedByGroup = true;
    displayMatches = displayMatches.sort((a, b) => {
      if (a.players[0].player.group.id != b.players[0].player.group.id) {
        return a.players[0].player.group.id < b.players[0].player.group.id ? -1 : 1;
      }
      const [topPlayerA, bottomPlayerA] = a.players.map(({ player }) => player);
      const [topPlayerB, bottomPlayerB] = b.players.map(({ player }) => player);

      if (topPlayerA.seed != topPlayerB.seed) {
        return topPlayerA.seed < topPlayerB.seed ? -1 : 1;
      }
      return bottomPlayerA.seed < bottomPlayerB.seed ? -1 : 1;
    });
  };
  const sortByTime = () => {
    sortedByGroup = false;
    displayMatches = displayMatches.sort((a, b) => a.time < b.time ? -1 : 1);
  }

  let displayMatches: IMatch[];
  let myMatches: IMatch[];
  $: if ($groupsMatches && $me?.player?.group) {
    myMatches = $groupsMatches.filter(match => match.players.find(({ player }) => player.id == $me.id));
  }
  $: displayMatches = $groupsMatches;
</script>
<!--
<div class="links">
  <a href="#/groups!maps">Rankings per map</a>
</div>
-->
{#if $me?.player?.group}
<div class="intro">
  Welcome to the Group Stage!<br /><br />
  You will be facing every other player of your group once (<b>Group {$me.player.group.id}</b>)!<br />
  You can find the list of your own matches just below.
</div>
<div class="matches">
{#each myMatches as match (match.id)}
  <GroupsMatch {match} />
{/each}
</div>
{/if}
{#if !displayMatches}
  <div class="matches">Loading groups matches...</div>
{:else}
  <div class="maps">
  {#each $groupsMaps as map (map.id)}
    <Map {map} />
  {/each}
  </div>
  <div class="matches">
    <div class="matches-links">
      <a href="javascript:void(0)" on:click={sortByTime}>Sort chronologically</a>
      <a href="javascript:void(0)" on:click={sortByGroup}>Sort by group</a>
    </div>
    {#each displayMatches as match, i (match.id)}
      <GroupsMatch {match} />
      {#if sortedByGroup && displayMatches[i+1]?.players[0].player.group.id > match.players[0].player.group.id}
        <div class="group-spacer" />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .intro {
    text-align: center;
    padding: 1em;
  }

  .maps {
    font-size: .8em;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em 0;
  }
  .maps :global(.map) {
    margin: .25em 0;
  }

  .matches {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .matches :global(.match) {
    margin: .25em 0;
  }
  .group-spacer {
    height: .5em;
    width: 20em;
    margin: 1em auto;
    background: #f97956;
    border-radius: 1em;
  }

  .links {
    font-size: 1.25em;
    display: flex;
    width: 20em;
    justify-content: space-between;
    margin: auto;
  }
  .matches-links {
    margin: 1em;
    display: flex;
    width: 20em;
    justify-content: space-between;
    margin: auto;
  }
</style>