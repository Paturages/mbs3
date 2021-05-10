export default `{
  maps(
    filter: {
      stage: {
        slug: {
          _eq: "qualifiers"
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
  }
  qualifier_scores(sort: "-score", limit: -1) {
    player {
      id
    }
    map {
      id
    }
    lobby {
      name
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
