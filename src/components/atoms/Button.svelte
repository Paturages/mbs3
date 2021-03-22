<script lang="ts">
  export let href: string;
</script>

<a {href} class="button">
  <div class="text">
    <slot />
  </div>
</a>

<style>
  .button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26.3em;
    height: 2.5em;
    padding: 1em;
    background: url('button-background.png');
    background-size: contain;
    background-repeat: no-repeat;
    font-family: "Winter";
    font-weight: bold;
    text-decoration: none;
    color: #f97956;
  }
  .text {
    font-size: 3em;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-shadow:
      1px 1px #fff,
      -1px 1px #fff,
      1px -1px #fff,
      -1px -1px #fff,
      1px 1px 5px #f97956;
  }
</style>