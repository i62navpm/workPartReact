import gql from 'graphql-tag'

export default gql(`
  {
    queryBusinessesByUserIdIndex(userId:"1") {
      items {
        id
        name
        date
        image
      }
    }
  }
  `)
