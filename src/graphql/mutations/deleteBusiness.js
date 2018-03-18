import gql from 'graphql-tag'

export default gql(`
  mutation deleteBusiness($input: DeleteBusinessInput!) {
    deleteBusiness(input: $input) {
      id
    }
  }
  `)
