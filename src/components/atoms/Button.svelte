<script lang="ts">
  export let href: string;
  export let target: string = '';
</script>

<span class="button">
  <a href={href || 'javascript:void(0)'} {target} rel={target === '_blank' ? 'noopener' : undefined} class="link" on:click>
    <div class="text">
      <slot />
    </div>
  </a>
</span>

<style>
  .link {
    white-space: nowrap;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 6em;
    height: 2.5em;
    padding: 1em 2em;
    margin: 0 3.7em;
    background: center/contain url('/images/button-background-center.png');
    font-family: "Winter";
    font-weight: bold;
    text-decoration: none;
    color: #f97956;
  }
  .link::before {
    z-index: 0;
    content: '';
    position: absolute;
    left: -3.5em;
    top: 0;
    height: 4.5em;
    min-width: 6em;
    background: no-repeat left/contain url('/images/button-background-left.png');
  }
  .link::after {
    z-index: 0;
    content: '';
    position: absolute;
    right: -3.5em;
    top: 0;
    height: 4.5em;
    min-width: 6em;
    background: no-repeat right/contain url('/images/button-background-right.png');
  }
  .link:hover {
    position: relative;
    top: 1px;
    left: 1px;
  }
  .text {
    z-index: 1;
    font-size: 3em;
    text-shadow:
      .02em .02em #fff,
      -.02em .02em #fff,
      .02em -.02em #fff,
      -.02em -.02em #fff,
      .02em .02em .1em #f97956;
  }
</style>