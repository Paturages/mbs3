<script lang="ts">
  import type { Match as IMatch, Map as IMap, Player as IPlayer } from '../types';
  import { me, api } from '../stores/core';
  import { groupsMatches, groupsMaps, init } from '../stores/groupsMatches';
  import GroupsMatch from '../components/molecules/GroupsMatch.svelte';
  import Map from '../components/molecules/Map.svelte';

  const selectMatch = ($event: MouseEvent, match?: IMatch) => {
    $event.preventDefault();
    selectedMatch = match;
    if (match) {
      localStorage.setItem('referee:match', String(match.id));
    } else {
      localStorage.removeItem('referee:match');
    }
  }

  const copy = (elt: HTMLInputElement) => {
    elt.select();
    elt.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  const saveRolls = async () => {
    if (!mpLink && !selectedMatch.link) return alert('Please fill the MP link!');
    if (!roll1 || !roll2) return alert('Please set the rolls!');
    // Optimistic update
    selectedMatch = {
      ...selectedMatch,
      rolls: [
        { player: selectedMatch.players[0].player, value: roll1 } as any,
        { player: selectedMatch.players[1].player, value: roll2 } as any
      ]
    };
    
    const res = await api('/items/rolls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        {
          match: selectedMatch.id,
          player: selectedMatch.players[0].player.id,
          value: roll1
        },
        {
          match: selectedMatch.id,
          player: selectedMatch.players[1].player.id,
          value: roll2
        }
      ])
    });
    if (!selectedMatch.link) {
      await api(`/items/matches/${selectedMatch.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          link: mpLink
        })
      });
    }
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      selectedMatch = {
        ...selectedMatch,
        link: mpLink,
        rolls: res.data
      }
    }
  }

  const protect = async ($event: MouseEvent, map: IMap, player: IPlayer) => {
    $event.preventDefault();
    // Optimistic update
    selectedMatch.protects = [...(selectedMatch.protects || []), {
      player,
      map
    } as any];
    const res = await api('/items/protects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        match: selectedMatch.id,
        player: player.id,
        map: map.id
      })
    });
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      selectedMatch.protects[selectedMatch.protects.length - 1].id = res.data.id;
    }
  }

  const ban = async ($event: MouseEvent, map: IMap, player: IPlayer) => {
    $event.preventDefault();
    // Optimistic update
    selectedMatch.bans = [...(selectedMatch.bans || []), {
      player,
      map
    } as any];
    const res = await api('/items/bans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        match: selectedMatch.id,
        player: player.id,
        map: map.id
      })
    });
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      selectedMatch.bans[selectedMatch.bans.length - 1].id = res.data.id;
    }
  }

  const pick = async ($event: MouseEvent, map: IMap) => {
    $event.preventDefault();
    // Optimistic update
    selectedMatch.picks = [...(selectedMatch.picks || []), {
      player: picker,
      map
    } as any];
    const res = await api('/items/picks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        match: selectedMatch.id,
        player: picker?.id,
        map: map.id
      })
    });
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      selectedMatch.picks[selectedMatch.picks.length - 1].id = res.data.id;
    }
  }

  let fetchingScores = false;
  const refreshScores = async (map: IMap) => {
    fetchingScores = true;
    const res = await api('/custom/matches/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ match: selectedMatch.id, map: map.id })
    });
    fetchingScores = false;
    if (res.errors) {
      alert(res.errors[0].message);
    } else {
      selectedMatch.scores = res;
    }
  };

  const overrideScores = async (map: IMap, player: IPlayer) => {
    const loser = player.id == selectedMatch.players[0].player.id ? 1 : 0;
    selectedMatch.scores = [
      ...selectedMatch.scores,
      { map, player, score: 1 } as any,
      { map, player: selectedMatch.players[loser].player, score: 0 } as any
    ];
  };

  $: if ($me && !$groupsMatches) init();
  let picker: IPlayer;
  let selectedMatch: IMatch;
  let init1, init2, init3, init4, init5, init6;
  let warmup1elt, warmup2elt;
  let rollelt, protectelt, banelt, pickelt, actionelt;

  let mpLink = '';
  let warmup1 = '', warmup2 = '';
  let roll1, roll2;
  let picks = [];
  let points1 = 0, points2 = 0;
  let riceCount = 0, lnCount = 0;
  let scorePending;

  $: rollWinner = roll1 > roll2 ? selectedMatch?.players[0].player : selectedMatch?.players[1].player;
  $: rollLoser = roll1 > roll2 ? selectedMatch?.players[1].player : selectedMatch?.players[0].player;
  $: [protect1, protect2] = selectedMatch?.protects?.map(p => p.map) || [];
  $: [ban1, ban2] = selectedMatch?.bans?.map(b => b.map) || [];
  $: {
    picker = rollWinner;
    points1 = 0;
    points2 = 0;
    riceCount = 0;
    lnCount = 0;
    picks = selectedMatch?.picks?.map(pick => {
      const res = {
        ...pick,
        scores: selectedMatch.scores?.filter(s => s.map.id == pick.map.id) || []
      };
      if (res.scores[0]?.player.id != selectedMatch.players[0].player.id) {
        res.scores = res.scores.reverse();
      }

      const [score1, score2] = res.scores;
      if (score1 && score2) {
        scorePending = false;
        if (score1.score > score2.score) {
          points1 += 1;
          picker = selectedMatch.players[1].player;
        } else {
          points2 += 1;
          picker = selectedMatch.players[0].player;
        }
      } else {
        scorePending = true;
      }

      if (pick.map.category == 'Rice') {
        riceCount += 1;
      } else {
        lnCount += 1;
      }

      return res;
    });
    if (points1 == 3 && points2 == 3) {
      picker == null; // tiebreaker
    }
  }

  let storedMatchId = localStorage.getItem('referee:match');
  $: if (storedMatchId && $groupsMatches) {
    selectedMatch = $groupsMatches.find(m => String(m.id) == storedMatchId);
  }
  let riceTiebreaker, hybridTiebreaker;
  $: if ($groupsMaps) {
    riceTiebreaker = $groupsMaps.find(m => m.category == 'Tiebreaker (rice)');
    hybridTiebreaker = $groupsMaps.find(m => m.category == 'Tiebreaker (hybrid)');
  }
</script>

<div class="container">
{#if !$me}
<a href={`${__myapp.env.API_URL}/auth/oauth/osu?redirect=${__myapp.env.UI_URL}`}>Login</a>
{:else if !$groupsMatches}
Loading matches...
{:else if !selectedMatch}
<div class="matches">
  Select a match
  {#each $groupsMatches as match (match.id)}
    {#if match.referee?.id == $me?.id}
      <div class="match-container">
        <GroupsMatch {match} on:click={$event => selectMatch($event, match)} />
      </div>
    {/if}
  {/each}
</div>
{:else}
<div class="match">
  <a href="#/referee!helper" on:click={$event => selectMatch($event)}>Back to matches</a>

  <center>
    <br /><br />
    <a href={`https://api.mbs3.fightthe.pw/admin/collections/matches/${selectedMatch.id}`} target="_blank">Emergency match editing link if you make a tremendous mistake</a>
    <br /><br />
  </center>

  <div class="players">
    <div class="points">{points1}</div>
    <div class="player">
      <img alt="" src={selectedMatch.players[0].player.avatar} />
      <a href={`https://osu.ppy.sh/users/${selectedMatch.players[0].player.id}`}>{selectedMatch.players[0].player.username} (#{selectedMatch.players[0].player.seed})</a>
    </div>
    <div class="vs">vs.</div>
    <div class="player">
      <img alt="" src={selectedMatch.players[1].player.avatar} />
      <a href={`https://osu.ppy.sh/users/${selectedMatch.players[1].player.id}`}>{selectedMatch.players[1].player.username} (#{selectedMatch.players[1].player.seed})</a>
    </div>
    <div class="points">{points2}</div>
  </div>

  <div class="init">
    Create and prepare your lobby
    <div>
      <input readonly value={`!mp make MBS3: (${selectedMatch.players[0].player.username}) vs. (${selectedMatch.players[1].player.username})`} bind:this={init1} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(init1)}>📝 Copy</a>
    </div>
    <div>
      <input readonly value="!mp set 0 3 3" bind:this={init2} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(init2)}>📝 Copy</a>
    </div>
    <div>
      <input readonly value="!mp mods Freemod" bind:this={init3} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(init3)}>📝 Copy</a>
    </div>
    <div>
      <input readonly value={`!mp addref ${selectedMatch.streamer?.username || 'Paturages'}`} bind:this={init4} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(init4)}>📝 Copy</a>
    </div>
    <div>
      <input readonly value={`!mp invite #${selectedMatch.players[0].player.id}`} bind:this={init5} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(init5)}>📝 Copy</a>
    </div>
    <div>
      <input readonly value={`!mp invite #${selectedMatch.players[1].player.id}`} bind:this={init6} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(init6)}>📝 Copy</a>
    </div>
  </div>

  {#if selectedMatch.link}
  <center><h1>
    <a href={selectedMatch.link}>MP Link</a>
  </h1></center>
  {:else}
  <div class="init">
    Paste your MP link here
    <div class="values">
      <input placeholder="MP Link" bind:value={mpLink} />
    </div>
  </div>
  {/if}

  <div class="warmups">
    <center>
      Warmup rules: 4 minutes max, non-offensive<br />
      Ask for them 30 minutes in advance
    </center>
    <div class="values">
      <input placeholder="Beatmap link 1" bind:value={warmup1} />
      <input placeholder="Beatmap link 2" bind:value={warmup2} />
    </div>
    <div class="warmup">
      <input readonly value={`!mp map ${warmup1.split('/').pop()} 3 ${selectedMatch.players[0].player.username}'s warmup`} bind:this={warmup1elt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(warmup1elt)}>📝 Copy</a>
    </div>
    <div class="warmup">
      <input readonly value={`!mp map ${warmup2.split('/').pop()} 3 ${selectedMatch.players[1].player.username}'s warmup`} bind:this={warmup2elt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(warmup2elt)}>📝 Copy</a>
    </div>
  </div>

  <div class="rolls">
    Rolls
    <div class="call">
      <input readonly value="Time to roll: each player will !roll, the highest one will protect first and ban second!" bind:this={rollelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(rollelt)}>📝 Copy</a>
    </div>
    {#if selectedMatch.rolls.length}
    <div class="values">
      <b>{selectedMatch.rolls[0].value}</b> vs.
      <b>{selectedMatch.rolls[1].value}</b>
    </div>
    {:else}
    <div class="values">
      <input placeholder="Roll 1" type="number" bind:value={roll1} />
      <input placeholder="Roll 2" type="number" bind:value={roll2} />
    </div>
    <button on:click={() => saveRolls()}>Confirm rolls</button>
    {/if}
  </div>

  {#if selectedMatch.protects[0]}
  <div class="protects">
    {rollWinner.username}'s protect
    <Map map={$groupsMaps.find(m => m.id == selectedMatch.protects[0].map.id)} />
  </div>
  {:else if selectedMatch.rolls[1]}
  <div class="protects">
    <center>
      Protects<br />
      Roll winner protects first
    </center>
    <div class="call">
      <input readonly value={`${rollWinner.username} wins the roll and protects first! Pick a map to protect: this map will not be able to be banned.`} bind:this={protectelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(protectelt)}>📝 Copy</a>
    </div>
    <div class="maps">
      {#each $groupsMaps as map (map.id)}
        {#if !map.category.startsWith('Tiebreaker')}
          <Map {map} on:click={$event => protect($event, map, rollWinner)} />
        {/if}
      {/each}
    </div>
  </div>
  {/if}
  {#if selectedMatch.protects[1]}
  <div class="protects">
    {rollLoser.username}'s protect
    <Map map={$groupsMaps.find(m => m.id == selectedMatch.protects[1].map.id)} />
  </div>
  {:else if selectedMatch.protects[0]}
  <div class="protects">
    <div class="call">
      <input readonly value={`${rollLoser.username} protects second: pick a map to protect`} bind:this={protectelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(protectelt)}>📝 Copy</a>
    </div>
    <div class="maps">
      {#each $groupsMaps as map (map.id)}
        {#if !map.category.startsWith('Tiebreaker') && protect1.id != map.id}
          <Map {map} on:click={$event => protect($event, map, rollLoser)} />
        {/if}
      {/each}
    </div>
  </div>
  {/if}

  <hr />

  {#if selectedMatch.bans[0]}
  <div class="bans">
    {rollLoser.username}'s ban
    <Map map={$groupsMaps.find(m => m.id == selectedMatch.bans[0].map.id)} />
  </div>
  {:else if selectedMatch.protects[1]}
  <div class="bans">
    <center>
      Bans<br />
      Roll loser bans first
    </center>
    <div class="call">
      <input readonly value={`${rollLoser.username} bans first! Pick a map to ban: this map will not be able to be picked in the match.`} bind:this={banelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(banelt)}>📝 Copy</a>
    </div>
    <div class="maps">
      {#each $groupsMaps as map (map.id)}
        {#if !map.category.startsWith('Tiebreaker') && protect1?.id != map.id && protect2?.id != map.id}
          <Map {map} on:click={$event => ban($event, map, rollLoser)} />
        {/if}
      {/each}
    </div>
  </div>
  {/if}
  {#if selectedMatch.bans[1]}
  <div class="bans">
    {rollWinner.username}'s ban
    <Map map={$groupsMaps.find(m => m.id == selectedMatch.bans[1].map.id)} />
  </div>
  {:else if selectedMatch.bans[0]}
  <div class="bans">
    <div class="call">
      <input readonly value={`${rollWinner.username}'s turn to ban: pick a map to ban`} bind:this={banelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(banelt)}>📝 Copy</a>
    </div>
    <div class="maps">
      {#each $groupsMaps as map (map.id)}
        {#if !map.category.startsWith('Tiebreaker') && protect1?.id != map.id && protect2?.id != map.id && ban1.id != map.id}
          <Map {map} on:click={$event => ban($event, map, rollWinner)} />
        {/if}
      {/each}
    </div>
  </div>
  {/if}
  
  <hr />

  {#if selectedMatch.bans[1]}
  <div class="picks">
    {#each picks as pick (pick.id)}
      {pick.player?.username || 'Tiebreaker'} picked
      <Map map={$groupsMaps.find(m => m.id == pick.map.id)} />
      {#if pick.scores.length}
        <div class="win">
          {pick.scores[0].score > pick.scores[1].score ? selectedMatch.players[0].player.username : selectedMatch.players[1].player.username}
          won the pick! ({pick.scores[0].score} vs. {pick.scores[1].score})
        </div>
      {:else}
      <div class="call">
        <input readonly value={`!mp map ${pick.map.id} 3`} bind:this={actionelt} />
        <a href="#/referee!helper" class="copy" on:click={() => copy(actionelt)}>📝 Copy</a>
      </div>
      <div class="fetcher">
        {#if fetchingScores}
          Fetching scores...
        {:else}
          <button on:click={() => refreshScores(pick.map)}>After the song is done (scores show up in chat), click to refresh the scores</button>
        {/if}
        <p>
          If it doesn't work or lags (likely to happen if osu doesn't cooperate), bypass this thing by manually selecting the winner. If it's totally broken, refresh the page lol
        </p>
        <p>
          <button on:click={() => overrideScores(pick.map, selectedMatch.players[0].player)}>{selectedMatch.players[0].player.username}</button>
          <button on:click={() => overrideScores(pick.map, selectedMatch.players[1].player)}>{selectedMatch.players[1].player.username}</button>
        </p>
      </div>
      {/if}
    {/each}
  </div>
  {#if !scorePending && points1 < 4 && points2 < 4 && !(points1 == 3 && points2 == 3)}
  <div class="picks">
    Picks (Picked: {riceCount} rice, {lnCount} LN/Hybrid; current TB = {riceCount < lnCount ? 'Tiebreaker (rice)' : 'Tiebreaker (hybrid)'})
    <div class="call">
      <input readonly value={
        selectedMatch.picks.length ? `${selectedMatch.players[0].player.username} ${points1} - ${points2} ${selectedMatch.players[1].player.username} | Loser's turn to pick: ${picker.username}, please pick a map!` :
          `${selectedMatch.players[0].player.username} ${points1} - ${points2} ${selectedMatch.players[1].player.username} | ${picker.username} picks first: please pick a map!`
      } bind:this={pickelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(pickelt)}>📝 Copy</a>
    </div>
    <div class="maps">
      {#each $groupsMaps as map (map.id)}
        {#if !map.category.startsWith('Tiebreaker') && ban1?.id != map.id && ban2?.id != map.id && !picks.find(p => p.map.id == map.id)}
          <Map {map} on:click={$event => pick($event, map)} />
        {/if}
      {/each}
    </div>
  </div>
  {/if}
  {/if}

  {#if points1 == 3 && points2 == 3 && scorePending}
  <div class="picks">
    <center>
      Woah, that's a tiebreaker situation! {riceCount} rice, {lnCount} LN/Hybrid, TB = {riceCount < lnCount ? 'Tiebreaker (rice)' : 'Tiebreaker (hybrid)'}<br />
      (Click on the tiebreaker to confirm it)
    </center>
    <div class="maps">
    {#if riceCount < lnCount}
      <Map map={riceTiebreaker} on:click={$event => pick($event, riceTiebreaker)} />
    {:else}
      <Map map={hybridTiebreaker} on:click={$event => pick($event, hybridTiebreaker)} />
    {/if}
    </div>
  </div>
  {/if}

  {#if points1 >= 4}
  <div class="winner">
    <div class="call">
      <input readonly value={`${selectedMatch.players[0].player.username} ${points1} - ${points2} ${selectedMatch.players[1].player.username} | ${selectedMatch.players[0].player.username} wins the match! Congratulations!`} bind:this={actionelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(actionelt)}>📝 Copy</a>
    </div>
  </div>
  {/if}
  {#if points2 >= 4}
  <div class="winner">
    <div class="call">
      <input readonly value={`${selectedMatch.players[0].player.username} ${points1} - ${points2} ${selectedMatch.players[1].player.username} | ${selectedMatch.players[1].player.username} wins the match! Congratulations!`} bind:this={actionelt} />
      <a href="#/referee!helper" class="copy" on:click={() => copy(actionelt)}>📝 Copy</a>
    </div>
  </div>
  {/if}
</div>
{/if}
</div>

<style>
  .container {
    min-height: 90vh;
    width: 98vw;
    margin: auto;
		background: #ffaa7e;
    border: 2px solid #eee;
    padding-bottom: 4em;
  }
  .matches {
    text-align: center;
    margin: 2em auto;
  }
  .matches :global(.match) {
    cursor: pointer;
    margin: .25em auto;
  }
  .matches :global(.match:hover) {
    background: #f97956;
  }

  
  .players {
    font-size: 1.25em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .player {
    display: flex;
    align-items: center;
  }
  .points {
    font-size: 1.5em;
    margin: 0 1em;
  }
  .vs {
    margin: 0 1em;
  }
  .player img {
    width: 1.5em;
    border-radius: 50%;
    margin-right: 1em;
  }
  
  .values {
    margin: .5em;
  }
  .values input {
    padding: .5em;
  }

  .init, .warmups, .rolls, .protects, .bans, .picks, .winner, .fetcher {
    margin: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .init input {
    width: 40em;
  }

  .warmup input {
    width: 20em;
  }

  .call input {
    width: 40em;
  }

  .maps {
    font-size: .8em;
    margin: 1em;
  }
  .maps :global(.map:hover) {
    cursor: pointer;
    opacity: .6;
  }

  .win {
    margin: 1em;
  }
</style>