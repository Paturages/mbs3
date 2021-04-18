<script>
  import { commentators, streamers, referees } from '../stores/core';
  import Button from '../components/atoms/Button.svelte';
</script>

<div class="section">
  <Button>Hosts</Button>
  <div class="container">
    <a href="https://osu.ppy.sh/users/1375479" target="_blank" rel="noopener">Paturages</a>&emsp;
    <a href="https://osu.ppy.sh/users/10047413" target="_blank" rel="noopener">Davvy</a>
  </div>
</div>
<div class="section">
  <Button>Graphic Designer</Button>
  <div class="container">
    <a href="https://osu.ppy.sh/users/9148286" target="_blank" rel="noopener">E-M-i</a>
  </div>
</div>
<div class="section">
  <Button>Mappool selectors</Button>
  <div class="container">
    <a href="https://osu.ppy.sh/users/1375479" target="_blank" rel="noopener">Paturages</a>&emsp;
    <a href="https://osu.ppy.sh/users/10047413" target="_blank" rel="noopener">Davvy</a>&emsp;
    <a href="https://osu.ppy.sh/users/11253722" target="_blank" rel="noopener">DannyPX</a>&emsp;
    <a href="https://osu.ppy.sh/users/11626065" target="_blank" rel="noopener">guden</a>&emsp;
    <a href="https://osu.ppy.sh/users/2124783" target="_blank" rel="noopener">Kamikaze</a>&emsp;
    <a href="https://osu.ppy.sh/users/8976576" target="_blank" rel="noopener">-mint-</a>&emsp;
    <a href="https://osu.ppy.sh/users/8642224" target="_blank" rel="noopener">Konohana Lucia</a>
  </div>
</div>
<div class="section">
  <Button>Donators</Button>
  <div class="container">
    <a href="https://osu.ppy.sh/users/8642224" target="_blank" rel="noopener">Konohana Lucia</a>
  </div>
</div>
<div class="section">
  <Button>Referees</Button>
  <div class="container">
  {#each $referees as ref, i}
    <a href={`https://osu.ppy.sh/users/${ref.id}`} target="_blank" rel="noopener">{ref.username}</a>&emsp;
  {/each}
</div>
</div>
<div class="section">
  <Button>Streamers</Button>
  <div class="container">
  {#each $streamers as streamer, i}
    <a href={`https://osu.ppy.sh/users/${streamer.id}`} target="_blank" rel="noopener">{streamer.username}</a>&emsp;
  {/each}
</div>
</div>
<div class="section">
  <Button>Commentators</Button>
  <div class="container">
  {#each $commentators as commentator, i}
    <a href={`https://osu.ppy.sh/users/${commentator.id}`} target="_blank" rel="noopener">{commentator.username}</a>&emsp;
  {/each}
</div>
</div>

<style>
  .section {
    text-align: center;
    margin: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .section :global(.link:hover) {
    top: 0;
    left: 0;
  }
  a {
    margin-right: .5em;
  }
  .container {
    margin: 0.5em;
    font-size: 1.25em;
  }
</style>