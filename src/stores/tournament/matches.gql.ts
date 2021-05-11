export default `query GetMatches($stage: String!) {
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
  }
  matches(
    filter: {
      stage: {
        slug: {
          _eq: $stage
        }
      }
    }
    sort: "time"
    limit: -1
  ) {
    id
    link
    players {
      player: players_id {
        id
        username
        avatar
        seed
      }
    }
    time
    referee {
      id
      username
    }
    streamer {
      id
      username
    }
    commentators {
      commentator: commentators_id {
        id
        username
      }
    }

    rolls {
      id
      player { id username }
      value
    }
    protects {
      id
      player { id username }
      map { id name category }
    }
    bans {
      id
      player { id username }
      map { id name category }
    }
    picks {
      id
      player { id username }
      map { id name category }
    }

    scores {
      id
      player { id }
      map { id }
      score
    }
    wbd {
      id
    }
  }
}`;
