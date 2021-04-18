<script lang="ts">
  import type { QualifierLobby as IQualifierLobby } from '../types';
  import QualifierLobby from '../components/molecules/QualifierLobby.svelte';
  import Map from '../components/molecules/Map.svelte';
  import { me, api } from '../stores/core';
  import { qualifierLobbies, qualifierMaps, init } from '../stores/qualifiers';

  if (!$qualifierLobbies) init();

  const toggleAvailable = (lobby: IQualifierLobby) => async () => {
    const existingEntry = lobby.available_referees.find(({ referee }) => referee.id == $me.id);
    const res = await api(`/items/qualifier_lobbies/${lobby.name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        available_referees: existingEntry ? { delete: [existingEntry.rel_id] } : { create: [{ referees_id: $me.id }] }
      })
    });
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      qualifierLobbies.set($qualifierLobbies.map(l => {
        if (l.name != lobby.name) return l;
        if (existingEntry) {
          l.available_referees = l.available_referees.filter(({ referee }) => referee.id != $me.id);
        } else {
          l.available_referees.push({
            rel_id: res.data.available_referees.pop(),
            referee: $me.referee
          });
        }
        return l;
      }));
    }
  };
  
  $: time = new Date($me?.qualifier?.time);
</script>

{#if $me?.qualifier}
<p class="intro">
  You are in <b>Lobby {$me.qualifier.name}</b> happening on
  <b>{time.toUTCString().replace(':00 GMT', ' UTC+0')}</b><br />
  (converted to your local time: <b>{time.toTimeString().replace(':00 GMT', ' UTC')}</b>).
  <br /><br />
  The referee will ping you on Discord (make sure you are in our Discord) <b>15 minutes</b> before the time<br />
  and will invite you in the multiplayer lobby <b>5 minutes</b> before the time. Make sure you are logged in the game by then!
  <br /><br />
  Once you are in the game, you will play all maps <b>2 times</b>:<br />
  the best score on each map will count in the final qualifiers leaderboard and determine your seed.
  <br /><br />
  If you need to reschedule your qualifier, please ask for it in the #reschedules channel in the Discord
  specifying a lobby name with a "free spot" in it (e.g. "Q5", "Q18", ...).<br />
  If there is no lobby that suits you, please specify a time instead: we will try to organize a special extra lobby.
</p>
{/if}
{#if !$qualifierLobbies}
  <p class="lobbies">Loading qualifier lobbies...</p>
{:else}
  <p class="maps">
  {#each $qualifierMaps as map (map.id)}
    <Map {map} />
  {/each}
  </p>
  <p class="lobbies">
  {#each $qualifierLobbies as lobby (lobby.name)}
    <QualifierLobby {lobby} toggleAvailable={$me?.referee && toggleAvailable(lobby)} />
  {/each}
  </p>
{/if}

<style>
  .intro {
    text-align: center;
    padding: 1em;
  }

  .maps {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1em;
  }
  .maps :global(.map) {
    margin: .25em 0;
  }

  .lobbies {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .lobbies :global(.lobby) {
    margin: .25em 0;
  }
</style>