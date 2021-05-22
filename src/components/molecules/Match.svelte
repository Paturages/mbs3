<script lang="ts">
  import type { Match } from '../../types';
  import { me } from '../../stores/core';
  import PlayerCompact from '../atoms/PlayerCompact.svelte';
  export let match: Match;
  export let toggleRefereeAvailable: (() => Promise<any>) | null = null;
  export let toggleStreamerAvailable: (() => Promise<any>) | null = null;
  export let toggleCommentatorAvailable: (() => Promise<any>) | null = null;

  const [topPlayer, bottomPlayer] = match.players.map(({ player }) => player);
  let time, isRefereeAdded, isStreamerAdded, isCommentatorAdded;
  $: {
    time = new Date(match.time);
    isRefereeAdded = toggleRefereeAvailable && match.available_referees.find(({ referee }) => referee.id == $me.id);
    isStreamerAdded = toggleStreamerAvailable && match.available_streamers.find(({ streamer }) => streamer.id == $me.id);
    isCommentatorAdded = toggleCommentatorAvailable && match.available_commentators.find(({ commentator }) => commentator.id == $me.id);
  }

  let settingRefereeAvailable;
  const handleToggleRefereeAvailable = async () => {
    settingRefereeAvailable = true;
    await toggleRefereeAvailable();
    settingRefereeAvailable = false;
  }
  let settingStreamerAvailable;
  const handleToggleStreamerAvailable = async () => {
    settingStreamerAvailable = true;
    await toggleStreamerAvailable();
    settingStreamerAvailable = false;
  }
  let settingCommentatorAvailable;
  const handleToggleCommentatorAvailable = async () => {
    settingCommentatorAvailable = true;
    await toggleCommentatorAvailable();
    settingCommentatorAvailable = false;
  }
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
  </div>
  <div class="body">
    <div class="time">
      <b>{time.toDateString()} {time.toTimeString().replace(':00 GMT', ' UTC')}</b>
      <div class="utc">{time.toUTCString().replace(':00 GMT', ' UTC+0')}</div>
    </div>
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
      
      {#if toggleRefereeAvailable}
        <br />
        <b>Available referees</b>:
        {#each match.available_referees as { referee } (referee.id)}
          <a class="staff-compact" title={referee.username} href={`https://osu.ppy.sh/users/${referee.id}`}>
            <img alt={referee.id} src={referee.avatar} />
          </a>
        {:else}None{/each}
        -
        {#if settingRefereeAvailable}
          Processing...
        {:else if isRefereeAdded}
          <a href="javascript:void(0)" on:click={handleToggleRefereeAvailable}>Remove yourself</a>
        {:else}
          <a href="javascript:void(0)" on:click={handleToggleRefereeAvailable}>Add yourself as available</a>
        {/if}
      {/if}
      {#if toggleStreamerAvailable}
        <br />
        <b>Available streamers</b>:
        {#each match.available_streamers as { streamer } (streamer.id)}
          <a class="staff-compact" title={streamer.username} href={`https://osu.ppy.sh/users/${streamer.id}`}>
            <img alt={streamer.id} src={streamer.avatar} />
          </a>
        {:else}None{/each}
        -
        {#if settingStreamerAvailable}
          Processing...
        {:else if isStreamerAdded}
          <a href="javascript:void(0)" on:click={handleToggleStreamerAvailable}>Remove yourself</a>
        {:else}
          <a href="javascript:void(0)" on:click={handleToggleStreamerAvailable}>Add yourself as available</a>
        {/if}
      {/if}
      {#if toggleCommentatorAvailable}
        <br />
        <b>Available commentators</b>:
        {#each match.available_commentators as { commentator } (commentator.id)}
          <a class="staff-compact" title={commentator.username} href={`https://osu.ppy.sh/users/${commentator.id}`}>
            <img alt={commentator.id} src={commentator.avatar} />
          </a>
        {:else}None{/each} -
        {#if settingCommentatorAvailable}
          Processing...
        {:else if isCommentatorAdded}
          <a href="javascript:void(0)" on:click={handleToggleCommentatorAvailable}>Remove yourself</a>
        {:else}
          <a href="javascript:void(0)" on:click={handleToggleCommentatorAvailable}>Add yourself as available</a>
        {/if}
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

  .name :global(.button) {
    font-size: .16em;
    position: absolute;
    bottom: -5em;
    left: 50%;
    transform: translateX(-50%);
  }

  .staff {
    margin: .25em 0;
  }

  .utc {
    opacity: .6;
  }
  .utc, .time {
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

  .staff-compact {
    margin: 0 .125em;
  }

  .staff-compact img {
    height: 1em;
    border-radius: 50%;
    border: 1px solid #eee;
  }

  .score {
    text-align: right;
    font-size: 1.5em;
    width: 5em;
    margin-right: 1em;
  }
</style>