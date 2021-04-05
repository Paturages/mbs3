<script lang="ts">
  import type { Stage } from "../../stores";

  export let stages: Stage[] = [];
  const now = new Date().toISOString();
  const displayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toUTCString().replace(' 00:00:00 GMT', '');
  }
</script>

<div class="schedule">
  {#each stages as stage, i (stage.slug)}
    <div class="stage" class:active={!i || stages[i-1].date_end < now}>
      <div class="stage-name">{stage.name}</div>
      <div class="stage-date">
        {displayDate(stage.date_start)}
      </div>
      <div class="stage-date">
        {displayDate(stage.date_end)}
      </div>
    </div>
  {:else}
    Loading...
  {/each}
</div>

<style>
  .schedule {
    display: flex;
    overflow-x: scroll;
    padding-bottom: 1em;
  }
  .stage {
    opacity: .5;
    text-align: center;
    margin: 0 .5em;
    width: 7.5em;
    flex-shrink: 0;
  }
  .stage.active {
    opacity: 1;
  }
  .stage-name {
    font-size: 1.25em;
    margin-bottom: .25em;
  }
  .stage-date {
    font-size: .8em;
  }
</style>