<script>
  import Button from '../components/atoms/Button.svelte';
  import Player from '../components/molecules/Player.svelte';
  import { me, players, api } from '../stores/core';

  let registering = false;
  const register = async () => {
    registering = true;
    const timezone = -new Date().getTimezoneOffset() / 60;
    const res = await api('/items/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: $me.id,
        timezone: `UTC${timezone > 0 ? '+' : ''}${timezone}`
      })
    });
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      me.set({ ...$me, player: res.data });
      players.set($players.concat([res.data]).sort((a, b) => b.ranking - a.ranking));
    }
    registering = false;
  };
</script>


{#if !$me}
  <p class="register">
    <Button href={`${__myapp.env.API_URL}/auth/oauth/osu?redirect=${__myapp.env.UI_URL}`}>
      Register
    </Button>
  </p>
{:else if !$me.player}
  <p class="confirm">
    {#if registering}Registering...{:else}
    <Button on:click={register} href="javascript:void(0)">
      Confirm registration
    </Button>
    {/if}
    Don't forget to
    <a href="https://discord.gg/uNSqksR" target="_blank" rel="noopener">join the Discord server</a>
    (this is also required!)
  </p>
{/if}

<p class="players">
{#if !$players}
  Loading players...
{:else}
  <div class="stats">Total players: {$players.length}</div>
  {#each $players as player (player.id)}
    <Player {player} />
  {:else}
    No players registered yet!
  {/each}
{/if}
</p>

<style>
  p {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .confirm :global(.button) :global(.text) {
    font-size: 2em;
  }
  .players :global(.player) {
    margin: .25em 0;
  }
</style>