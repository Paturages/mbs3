<script lang="ts">
  import Button from '../components/atoms/Button.svelte';
  import { me } from '../stores';

  $: registerUrl = $me ? '#/players' : `${__myapp.env.API_URL}/auth/oauth/osu?redirect=${__myapp.env.UI_URL}`;
</script>

<main>
  <div class="links">
    <div class="register">
      <Button href={registerUrl}>
        Register here!
      </Button>
    </div>
  </div>
</main>

<style>
  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 4em;
  }

  .links > :global(.button) {
    margin: .5em 0;
  }

  .register {
    font-size: 1.5em;
    margin-bottom: 1em;
  }
</style>