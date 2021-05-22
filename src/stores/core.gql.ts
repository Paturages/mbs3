export default `{
  stages(sort: "sort") {
    slug
    name
    date_start
    date_end
    link
    best_of
  }
  players(sort: ["-elite", "seed", "ranking"], limit: -1) {
    id
    seed
    group {
      id
    }
    alive
    elite
    username
    discord
    country
    country_code
    avatar
    timezone
    ranking
    pp
    qualifier {
      name
      link
      time
    }
    matches {
      match: matches_id {
        id
        stage {
          name
        }
      }
    }
  }
  referees {
    id
    username
    discord
    country
    country_code
    avatar
    timezone
  }
  commentators {
    id
    username
    discord
    country
    country_code
    avatar
    timezone
  }
  streamers {
    id
    username
    discord
    country
    country_code
    avatar
    timezone
  }
}`;
