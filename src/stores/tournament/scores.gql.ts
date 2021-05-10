export default `query GetScores($stage: String!) {
  maps(
    filter: {
      stage: {
        slug: {
          _eq: $stage
        }
      }
    }
    sort: "order"
  ) {
    id
    artist
    name
    weight
    difficulty
    charter
    charter_id
    category
    bpm
    length
    od
    hp
    sr
    cover
    bans {
      player {
        username
      }
    }
    protects {
      player {
        username
      }
    }
  }
  scores(sort: "-score", limit: -1) {
    player {
      id
    }
    map {
      id
    }
    match {
      id
      link
    }
    score
    combo
    c320
    c300
    c200
    c100
    c50
    c0
  }
}`;
