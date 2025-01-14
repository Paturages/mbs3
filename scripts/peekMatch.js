var API_KEY_V1 = "..."; // confidential, use your own

(async () => {
  const mpId = location.href.split('/').pop();
  console.log(`Fetching match ID ${mpId}...`);
  const res = await fetch(`https://osu.ppy.sh/api/get_match?k=${API_KEY_V1}&mp=${mpId}`);
  const json = await res.json();
  console.log("Match", json.match.match_id, json.match.name);
  for (const game of json.games) {
    console.log([
      ['beatmap_id','user_id','score','maxcombo','count0','count50','count100','count200','count300','count305'].join('\t'),
      ...game.scores.map(score => [
        game.beatmap_id,
        score.user_id,
        score.score,
        score.maxcombo,
        score.countmiss,
        score.count50,
        score.count100,
        score.countkatu,
        score.count300,
        score.countgeki,
      ].join('\t'))
    ].join('\n'));
  }
})();
