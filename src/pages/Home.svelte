<script>
  import Button from '../components/atoms/Button.svelte';
</script>

<main>
  <div class="logo">
    <img alt="" src="logo.png" />
  </div>
	<h1>
		<img alt="Mania Beginner's Showdown" src="title.png" />
    <div class="three"><span>3</span></div>
	</h1>
  <p class="links">
    <Button href="#">Register</Button>
    <Button href="#">Discord</Button>
    <Button href="#">Rules</Button>
    <Button href="#">Players</Button>
    <Button href="#">Staff</Button>
    <Button href="#">Mappools</Button>
  </p>
</main>

<style>
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

  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 4em;
  }

  .links > :global(.button) {
    margin: .5em 0;
  }
</style>