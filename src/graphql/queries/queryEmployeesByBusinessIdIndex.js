import gql from 'graphql-tag'

export default gql(`
  query($businessId: ID!){
    queryEmployeesByBusinessIdIndex(businessId: $businessId) {
      items {
        id
        name
        image
      }
    }
  }
  `)
