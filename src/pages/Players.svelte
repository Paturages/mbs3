<script>
  import Button from '../components/atoms/Button.svelte';
  import Player from '../components/molecules/Player.svelte';
  import { me, players, api } from '../stores';

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
      players.set($players.concat([res]).sort((a, b) => b.ranking - a.ranking));
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
  </p>
{:else}
  <p class="registration">
    List of players
  </p>
{/if}

{#if !$players}
  Loading players...
{:else}
<p class="players">
  {#each $players as player}
    <Player {player} />
  {/each}
</p>
{/if}

<style>
  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 4em;
  }
  .confirm :global(.button) :global(.text) {
    font-size: 2em;
  }
  .players :global(.player) {
    margin: .5em 0;
  }
</style>