<script lang="ts">
  import type { Map } from '../../types';
  export let map: Map;
</script>

<div
  class="map"
  style={`background-image:url(${map.cover})`}
  class:rice={map.category.toLowerCase().match(/rice|tech/)}
  class:ln={map.category.toLowerCase().includes('ln')}
  class:hybrid={map.category.toLowerCase().includes('hybrid')}
  class:tiebreaker={map.category.toLowerCase().includes('tiebreaker')}
  on:click
>
  <div class="container">
    <div class="header">
      <a class="name" href={`https://osu.ppy.sh/beatmaps/${map.id}`} target="_blank" rel="noopener">
        {map.artist} - {map.name}<br />{map.difficulty}
      </a>
      <div class="category">{map.category}</div>
    </div>
    <div class="body">
      <div class="mapper">
        Mapset by <a href={`https://osu.ppy.sh/users/${map.charter_id}`}>{map.charter}</a>
      </div>
      <div class="stats">
        <span class="stat-item">
          ⭐ {map.sr}
        </span>
        <span class="stat-item">
          ⏰ {map.length}
        </span>
        <span class="stat-item">
          🎵 {map.bpm} BPM
        </span>
        <span class="stat-item">
          🎯 OD {map.od}
        </span>
        <span class="stat-item">
          ❤️ HP {map.hp}
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .map {
    width: 50em;
    text-decoration: none;
    box-shadow: 0 0 2px #ffd081;
    border-radius: 5px;
    background-size: cover;
    background-position: center;
    color: #fff;
  }
  .map a {
    color: #fff;
  }
  .container {
    padding: 1em;
    background: #0009;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .name {
    margin-bottom: .5em;
  }
  .category {
    font-size: 1.25em;
  }
  .body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .stats {
    font-size: .8em;
  }
  .stat-item {
    margin-left: .25em;
  }

  .rice {
    border-left: 5px solid #2196f3;
  }
  .ln {
    border-left: 5px solid #f44336;
  }
  .hybrid {
    border-left: 5px solid #ffeb3b;
  }
  .tiebreaker {
    border-left: 5px solid #880e4f;
  }
</style>