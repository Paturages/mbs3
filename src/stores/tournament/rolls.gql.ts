export default `query GetRolls($stage: String!) {
  rolls(
    filter: {
      match: {
        stage: {
          slug: {
            _eq: $stage
          }
        }
      }
    }
    sort: "-value"
    limit: -1
  ) {
    player {
      id
      username
    }
    value
  }
}`;
