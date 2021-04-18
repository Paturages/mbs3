<script lang="ts">
  import Button from '../atoms/Button.svelte';
</script>

<nav>
  <ul>
    <li>
      <Button href="https://osu.ppy.sh/community/forums/topics/1280306" target="_blank">
        Forum post
      </Button>
    </li>
    <li>
      <Button href="https://discord.gg/uNSqksR" target="_blank">
        Discord
      </Button>
    </li>
    <li>
      <Button href="#/players">Players</Button>
    </li>
    <li>
      <Button href="#/countries">Countries</Button>
    </li>
  </ul>
</nav>

<style>
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: center;
    font-size: .5em;
  }
  li {
    margin: 0 1em;
  }
</style>