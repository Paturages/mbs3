<script lang="ts">
  import type { Player, Score } from '../../types';
  import { me } from '../../stores/core';
  export let player: Player;
  export let score: Score;
  
  const totalCount = score.c320 + score.c300 + score.c200 + score.c100 + score.c50 + score.c0;
  const accuracy = (
    (305 * score.c320) +
    (300 * score.c300) +
    (200 * score.c200) +
    (100 * score.c100) +
    (50 * score.c50)
  ) / (3.05 * totalCount);
</script>

<div class="score" class:me={$me?.id == player.id}>
  <div class="position">{score.position}.</div>
  <div class="player">
    <a href={`https://osu.ppy.sh/users/${player.id}`} target="_blank" rel="noopener">
      {player.username}
    </a>
  </div>
  <div class="value">
    {score.score}
    <div class="details">
      {accuracy.toFixed(2)}%, x{score.combo}
    </div>
  </div>
  <div class="judgements">
    <div class="judgement">
      {score.c320}
    </div>
    <div class="judgement">
      {score.c300}
    </div>
    <div class="judgement">
      {score.c200}
    </div>
    <div class="judgement">
      {score.c100}
    </div>
    <div class="judgement">
      {score.c50}
    </div>
    <div class="judgement">
      {score.c0}
    </div>
  </div>
</div>

<style>
  .score {
    display: flex;
    align-items: center;
    background: #ffd08180;
    padding: .25em 0;
  }
  .score:nth-child(2n) {
    background: #ffd081c0;
  }
  .score.me {
    background: #f97956;
  }
  .position {
    width: 3em;
    text-align: right;
    margin-right: .5em;
  }
  .player {
    width: 10em;
  }
  .value {
    width: 10em;
  }
  .details {
    font-size: .8em;
  }
  .judgements {
    display: flex;
    font-size: .8em;
  }
  .judgement {
    width: 4.5em;
  }
</style>
