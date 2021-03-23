<script lang="ts">
  import { me } from '../../stores';

  const logout = async () => {
    await fetch(`${__myapp.env.API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    location.reload();
  };
</script>

<div class="banner">
  <a href="#/">
    <div class="logo">
      <img alt="" src="/images/logo.png" />
    </div>
    <h1>
      <img alt="Mania Beginner's Showdown" src="/images/title.png" />
      <div class="three"><span>3</span></div>
    </h1>
  </a>
  {#if $me}
  <div class="me">
    Logged in as
    <b>{$me.username}</b> -
    <a href="#/" on:click={logout}>Log out</a>
  </div>
  {/if}
</div>

<style>
  .banner {
    position: relative;
  }

  .logo {
    position: relative;
    z-index: 1;
    margin: 1em 0 -3em 0;
    text-align: center;
  }
  .logo img {
    width: 15em;
  }

	h1 {
    position: relative;
		background: #ffaa7e;
    border-top: 2px solid #eee;
    border-bottom: 2px solid #eee;
		text-align: center;
    padding: .5em;
	}

	h1 img {
		width: 500px;
	}

  .three {
    position: absolute;
    top: 1.25em;
    left: 50%;
    transform: translateX(-50%);
    font-family: "Winter";
    font-size: 1.75em;
    color: #f97956;
    background: #ffaa7e;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    border-bottom: 2px solid #eee;
    text-shadow:
      1px 1px #fff,
      -1px 1px #fff,
      1px -1px #fff,
      -1px -1px #fff,
      1px 1px 5px #f97956;
  }

  .three span {
    position: relative;
    top: -.1em;
  }

  .me {
    position: absolute;
    right: 1em;
    bottom: -2em;
  }
</style>