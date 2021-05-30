<script lang="ts">
  import Banner from './components/organisms/Banner.svelte';
  import Nav from './components/organisms/Nav.svelte';
  import Schedule from './components/organisms/Schedule.svelte';

	import Staff from './pages/Staff.svelte';

	import Players from './pages/signup/Players.svelte';
	import Countries from './pages/signup/Countries.svelte';

	import QualifierLobbies from './pages/qualifiers/Lobbies.svelte';
	import QualifierMaps from './pages/qualifiers/Maps.svelte';
	import QualifierPlayers from './pages/qualifiers/Players.svelte';
	import EliteQualifierMaps from './pages/qualifiers/EliteMaps.svelte';
	import EliteQualifierPlayers from './pages/qualifiers/ElitePlayers.svelte';
	
	import GroupsMatches from './pages/groups/Matches.svelte';
	import GroupsResults from './pages/groups/Results.svelte';
	
	import BracketMatches from './pages/brackets/Matches.svelte';
	import BracketMaps from './pages/brackets/Maps.svelte';
	import BracketRolls from './pages/brackets/Rolls.svelte';

	import ScuffedDrawing from './pages/staff/ScuffedDrawing.svelte';
	import RefereeHelper from './pages/staff/RefereeHelper.svelte';

	import { page, stages } from './stores/core';

</script>

{#if $page == 'scuffed!drawing'}
	<ScuffedDrawing />
{:else if $page == 'referee!helper'}
	<RefereeHelper />
{:else}
<Banner />
<div class="body">
	<Nav />
	<Schedule stages={$stages} />
	<div class="page">
		{#if $page == 'players'}
			<Players />
		{:else if $page == 'countries'}
			<Countries />

		{:else if $page == 'qualifiers'}
			<QualifierPlayers />
		{:else if $page == 'qualifiers!maps'}
			<QualifierMaps />
		{:else if $page == 'qualifiers!elite'}
			<EliteQualifierPlayers />
		{:else if $page == 'qualifiers!elite!maps'}
			<EliteQualifierMaps />
		{:else if $page == 'qualifiers!lobbies'}
			<QualifierLobbies />

		{:else if $page == 'groups'}
			<GroupsMatches />
		{:else if $page == 'groups!results'}
			<GroupsResults />
		{:else if $page == 'groups!maps'}
			<BracketMaps stage="groups" />
		{:else if $page == 'groups!rolls'}
			<BracketRolls stage="groups" />

		{:else if $page == 'ro64'}
			<BracketMatches stage="ro64" />
		{:else if $page == 'ro64!maps'}
			<BracketMaps stage="ro64" />
		{:else if $page == 'ro64!rolls'}
			<BracketRolls stage="ro64" />

		{:else if $page == 'ro32'}
			<BracketMatches stage="ro32" />
		{:else if $page == 'ro32!maps'}
			<BracketMaps stage="ro32" />
		{:else if $page == 'ro32!rolls'}
			<BracketRolls stage="ro32" />

		{:else if $page == 'ro16'}
			<BracketMatches stage="ro16" />
		{:else if $page == 'ro16!maps'}
			<BracketMaps stage="ro16" />
		{:else if $page == 'ro16!rolls'}
			<BracketRolls stage="ro16" />

		{:else if $page == 'qf'}
			<BracketMatches stage="qf" />
		{:else if $page == 'qf!maps'}
			<BracketMaps stage="qf" />
		{:else if $page == 'qf!rolls'}
			<BracketRolls stage="qf" />

		{:else}
			<Staff />
		{/if}
	</div>
</div>
{/if}

<style>
	.body {
		margin: 2em auto 4em;
		padding: 1em 0;
		max-width: 1024px;
		background: #ffaa7e;
    border: 2px solid #eee;
		border-radius: 5px;
	}
	:global(nav) {
		margin-top: -2.25em;
		margin-bottom: 1em;
	}
	.page {
		padding: 1em 0;
	}
</style>