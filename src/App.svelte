<script lang="ts">
  import Banner from './components/organisms/Banner.svelte';
  import Nav from './components/organisms/Nav.svelte';
  import Schedule from './components/organisms/Schedule.svelte';

	import Staff from './pages/Staff.svelte';
	import Players from './pages/Players.svelte';
	import Countries from './pages/Countries.svelte';
	import Qualifiers from './pages/Qualifiers.svelte';

	import { page, stages } from './stores/core';

</script>

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
			<Qualifiers />
		{:else}
			<Staff />
		{/if}
	</div>
</div>

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