<script lang="ts">
  import Banner from './components/organisms/Banner.svelte';
  import Nav from './components/organisms/Nav.svelte';
  import Schedule from './components/organisms/Schedule.svelte';

	import Staff from './pages/Staff.svelte';
	import Players from './pages/Players.svelte';
	import Countries from './pages/Countries.svelte';
	import QualifierLobbies from './pages/QualifierLobbies.svelte';
	import QualifierMaps from './pages/QualifierMaps.svelte';
	import QualifierPlayers from './pages/QualifierPlayers.svelte';
	import EliteQualifierMaps from './pages/EliteQualifierMaps.svelte';
	import EliteQualifierPlayers from './pages/EliteQualifierPlayers.svelte';
	import GroupsMatches from './pages/GroupsMatches.svelte';
	import ScuffedDrawing from './pages/ScuffedDrawing.svelte';

	import { page, stages } from './stores/core';

</script>

{#if $page == 'scuffed!drawing'}
	<ScuffedDrawing />
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