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
        country
        country_code
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

    available_referees {
      rel_id: id
      referee: referees_id {
        id
        avatar
        username
      }
    }
    available_streamers {
      rel_id: id
      streamer: streamers_id {
        id
        avatar
        username
      }
    }
    available_commentators {
      rel_id: id
      commentator: commentators_id {
        id
        avatar
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
      map { id name category weight }
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
