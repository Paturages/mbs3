export default `{
  stages(sort: "sort") {
    slug
    name
    date_start
    date_end
    link
    best_of
  }
  players(sort: "ranking", limit: -1) {
    id
    seed
    group {
      id
    }
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
