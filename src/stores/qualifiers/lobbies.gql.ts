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
  qualifier_lobbies(sort: "time") {
    name
    link
    players {
      id
      username
    }
    time
    referee {
      id
      username
    }
    available_referees {
      rel_id: id
      referee: referees_id {
        id
        username
      }
    }
  }
}`;
