<script lang="ts">
  import { DateTime } from 'luxon';
  import type { Match } from '../../types';
  import { me } from '../../stores/core';
  import PlayerCompact from '../atoms/PlayerCompact.svelte';
  export let match: Match;

  const [topPlayer, bottomPlayer] = match.players.map(({ player }) => player);
  const now = DateTime.now();
  const time = DateTime.fromISO(match.time);
  const utc = time.setZone('utc');
  const matchHappened = time < now;
  const diff = time.diff(now, ['days', 'hours', 'minutes']).toObject();
</script>

<div class="match" class:my-match={$me?.id == topPlayer.id || $me?.id == bottomPlayer.id} on:click>
  <div class="name">
    {#if match.link}
      <a href={match.link} target="_blank" rel="noopener">
        M{match.id}
      </a>
    {:else}
      M{match.id}
    {/if}
    {#if topPlayer.elite}
      <div class="desc">Elite</div>
    {/if}
    <div class="desc">{match.loser ? 'Losers' : 'Winners'}</div>
    {#if match.dependencies?.length}
    <div class="desc">(conditional)</div>
    {/if}
  </div>
  <div class="body">
    <div class="time">
      <b>{time.toLocaleString(DateTime.DATETIME_HUGE)}</b>
      <div class="utc">
        ({utc.toLocaleString(DateTime.DATETIME_FULL)}{#if !matchHappened},
        in {diff.days} days, {diff.hours} hours and {diff.minutes >> 0} minutes{/if})
      </div>
    </div>
    {#if match.dependencies}
    <div class="deps">
      depends on{#each match.dependencies as dep, i (dep.id)}
        {#if i}, {/if}
        M{dep.id} ({DateTime.fromISO(dep.time).toLocaleString(DateTime.DATETIME_FULL)})
      {/each}
    </div>
    {/if}
    {#if match.dependents}
    <div class="deps">
      affects{#each match.dependents as dep, i (dep.id)}
        {#if i}, {/if}
        M{dep.id} ({DateTime.fromISO(dep.time).toLocaleString(DateTime.DATETIME_FULL)})
      {/each}
    </div>
    {/if}
    <div class="staff">
      <b>Referee</b>:
      {#if match.referee}
        <a href={`https://osu.ppy.sh/users/${match.referee.id}`}>{match.referee.username}</a>
      {:else}
        To be defined
      {/if}
      {#if match.streamer}
        -
        <b>Streamer</b>:
        <a href={`https://osu.ppy.sh/users/${match.streamer.id}`}>{match.streamer.username}</a>
      {/if}
      {#if match.commentators.length}
        -
        <b>Commentators</b>:
        {#each match.commentators as { commentator }, i}
          {#if i}, {/if}
          <a href={`https://osu.ppy.sh/users/${commentator.id}`}>{commentator.username}</a>
        {/each}
      {/if}
    </div>
    <div class="players">
      <PlayerCompact player={topPlayer} />
      <div class="vs">vs.</div>
      <PlayerCompact player={bottomPlayer} />
    </div>
  </div>
  <div class="score">{match.points1 || 0} - {match.points2 || 0}</div>
</div>

<style>
  .match {
    display: flex;
    align-items: center;
    background: #ffd08180;
    width: 50em;
    padding: .25em 0;
    border-radius: 1em;
    text-decoration: none;
    box-shadow: 0 0 2px #ffd081;
  }
  .match:nth-child(2n) {
    background: #ffd081c0;
  }
  .match.my-match {
    background: #f97956;
  }

  .name {
    font-size: 1.5em;
    width: 5em;
    padding: 0 .5em;
    position: relative;
    flex-shrink: 0;
  }
  .desc {
    font-size: .75em;
  }

  .deps {
    font-size: .75em;
  }

  .staff {
    margin: .25em 0;
  }

  .utc {
    opacity: .7;
  }
  .time {
    font-size: .8em;
  }

  .players {
    display: flex;
    align-items: center;
  }
  .vs {
    margin: 0 1em;
  }

  .body {
    flex: 1;
  }

  .score {
    text-align: right;
    font-size: 1.5em;
    width: 5em;
    margin-right: 1em;
  }
</style>