<script lang="ts">
  import type { QualifierLobby } from '../../types';
  import { me } from '../../stores/core';
  export let lobby: QualifierLobby;
  export let toggleAvailable: () => Promise<any>;

  let processing;
  const handleClick = async () => {
    processing = true;
    await toggleAvailable();
    processing = false;
  }

  $: time = new Date(lobby.time);
  $: isAdded = toggleAvailable && lobby.available_referees.find(({ referee }) => referee.id == $me.id);
</script>

<div class="lobby">
  <div class="name">
    {#if lobby.link}
      <a href={lobby.link} target="_blank" rel="noopener">
        {lobby.name}
      </a>
    {:else}
      {lobby.name}
    {/if}
  </div>
  <div class="body">
    <div class="utc">{time.toUTCString().replace(':00 GMT', ' UTC+0')}</div>
    <div class="time">Your local time: <b>{time.toTimeString().replace(':00 GMT', ' UTC')}</b></div>
    <div class="referee">
      <b>Referee</b>:
      {#if lobby.referee}
        <a href={`https://osu.ppy.sh/users/${lobby.referee.id}`}>{lobby.referee.username}</a>
      {:else}
        To be defined
      {/if}
      {#if toggleAvailable}
        <br />
        <b>Available referees</b>:
        {lobby.available_referees.map(({ referee }) => referee.username).join(', ') || 'None'} -
        {#if processing}
          Processing...
        {:else if isAdded}
          <a href="javascript:void(0)" on:click={handleClick}>Remove yourself</a>
        {:else}
          <a href="javascript:void(0)" on:click={handleClick}>Add yourself as available</a>
        {/if}
      {/if}
    </div>
    <div class="players">
      {#each [0, 1, 2, 3, 4, 5, 6, 7] as i}
        {#if lobby.players[i]}
          <a href={`https://osu.ppy.sh/users/${lobby.players[i].id}`}>{lobby.players[i].username}</a>
        {:else}
          <a>Free spot!</a>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .lobby {
    display: flex;
    align-items: center;
    background: #ffd08180;
    width: 50em;
    padding: .25em 0;
    border-radius: 1em;
    text-decoration: none;
    box-shadow: 0 0 2px #ffd081;
  }
  .lobby:nth-child(2n) {
    background: #ffd081c0;
  }

  .name {
    font-size: 2em;
    width: 4.25em;
    padding: 0 .5em;
  }

  .referee {
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
    flex-flow: row wrap;
  }
  .players a {
    width: 10.9em;
  }
</style>