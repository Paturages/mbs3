<script lang="ts">
  import Banner from './components/organisms/Banner.svelte';

	import Players from './pages/Players.svelte';
	import Home from './pages/Home.svelte';
	import Countries from './pages/Countries.svelte';

	import { page } from './stores';

</script>

<Banner />
{#if $page == 'players'}
	<Players />
{:else if $page == 'countries'}
	<Countries />
{:else}
	<Home />
{/if}
