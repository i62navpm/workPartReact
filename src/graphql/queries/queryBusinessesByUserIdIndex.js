import gql from 'graphql-tag'

export default gql(`
  query($userId: ID!){
    queryBusinessesByUserIdIndex(userId: $userId) {
      items {
        id
        name
        date
        image
      }
    }
  }
  `)
