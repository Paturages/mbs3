<script lang="ts">
  import Banner from './components/organisms/Banner.svelte';
  import Nav from './components/organisms/Nav.svelte';
  import Schedule from './components/organisms/Schedule.svelte';

	import Players from './pages/Players.svelte';
	import Home from './pages/Home.svelte';
	import Countries from './pages/Countries.svelte';

	import { page, stages } from './stores';

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
		{:else}
			<Home />
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