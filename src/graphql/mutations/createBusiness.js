import gql from 'graphql-tag'

export default gql(`
  mutation createBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      id
      userId
      name
      cif
      date
      image
    }
  }
  `)
