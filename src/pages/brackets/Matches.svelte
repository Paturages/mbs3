<script lang="ts">
  import type { Match as IMatch } from '../../types';
  import Match from '../../components/molecules/Match.svelte';
  import Map from '../../components/molecules/Map.svelte';
  import { me, api } from '../../stores/core';
  import { stage as currentStage, matches, maps, init } from '../../stores/tournament/matches';

  export let stage: string;

  if ($currentStage != stage || !$matches) init(stage);

  let myMatches: IMatch[];
  $: if ($matches && $me?.player?.group && !myMatches) {
    myMatches = $matches.filter(match => match.players.find(({ player }) => player.id == $me.id));
  }
  
  const toggleAvailable = (entity: 'referee' | 'streamer' | 'commentator', match: IMatch) => async () => {
    const existingEntry = match[`available_${entity}s`].find(x => x[entity].id == $me.id);
    const res = await api(`/items/matches/${match.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [`available_${entity}s`]: existingEntry ? { delete: [existingEntry.rel_id] } : { create: [{ [`${entity}s_id`]: $me.id }] }
      })
    });
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      matches.set($matches.map(m => {
        if (m.id != match.id) return m;
        if (existingEntry) {
          m[`available_${entity}s`] = m[`available_${entity}s`].filter(x => x[entity].id != $me.id);
        } else {
          m[`available_${entity}s`].push({
            rel_id: res.data[`available_${entity}s`].pop(),
            [entity]: $me[entity]
          });
        }
        return m;
      }));
    }
  };
</script>

<div class="links">
  <a href={`#/${stage}!maps`}>Rankings per map</a>
  <a href={`#/${stage}!rolls`}>Roll leaderboard</a>
</div>

{#if myMatches?.length}
<div class="intro">
  You have matches for this stage!<br />
  You can find the list of your own matches just below.
</div>
<div class="matches">
{#each myMatches as match (match.id)}
  <Match {match} />
{/each}
</div>
{/if}
{#if !$matches}
  <div class="matches">Loading matches...</div>
{:else}
  <div class="maps">
  {#each $maps as map (map.id)}
    <Map {map} />
  {/each}
  </div>
  <div class="matches">
    {#each $matches as match, i (match.id)}
      <Match
        {match}
        toggleRefereeAvailable={$me?.referee && toggleAvailable('referee', match)}
        toggleStreamerAvailable={$me?.streamer && toggleAvailable('streamer', match)}
        toggleCommentatorAvailable={$me?.commentator && toggleAvailable('commentator', match)}
      />
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

  .links {
    font-size: 1.25em;
    display: flex;
    width: 30em;
    justify-content: space-between;
    margin: auto;
  }
</style>