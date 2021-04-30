export default `{
  maps(
    filter: {
      stage: {
        slug: {
          _eq: "groups"
        }
      }
    }
    sort: "order"
  ) {
    id
    artist
    name
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
          _eq: "groups"
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
        group {
          id
        }
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
      map { id }
    }
    bans {
      id
      player { id username }
      map { id }
    }
    picks {
      id
      player { id username }
      map { id category }
    }

    scores {
      id
      player { id }
      map { id }
      score
      combo
      c320
      c300
      c200
      c100
      c50
      c0
    }
    wbd {
      id
    }
  }
}`;
