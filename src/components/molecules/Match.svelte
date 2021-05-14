<script lang="ts">
  import type { Match } from '../../types';
  import { me } from '../../stores/core';
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
        {match.available_referees.map(({ referee }) => referee.username).join(', ') || 'None'} -
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
        {match.available_streamers.map(({ streamer }) => streamer.username).join(', ') || 'None'} -
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
        {match.available_commentators.map(({ commentator }) => commentator.username).join(', ') || 'None'} -
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
      <div class="player">
        <img alt="" src={topPlayer.avatar} />
        <a href={`https://osu.ppy.sh/users/${topPlayer.id}`}>{topPlayer.username} (#{topPlayer.seed})</a>
      </div>
      <div class="vs">vs.</div>
      <div class="player">
        <img alt="" src={bottomPlayer.avatar} />
        <a href={`https://osu.ppy.sh/users/${bottomPlayer.id}`}>{bottomPlayer.username} (#{bottomPlayer.seed})</a>
      </div>
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
  .player {
    display: flex;
    align-items: center;
  }
  .vs {
    margin: 0 1em;
  }
  .player img {
    width: 1.5em;
    border-radius: 50%;
    margin-right: 1em;
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