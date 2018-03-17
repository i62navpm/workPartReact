import gql from 'graphql-tag'

export default gql(`
  mutation createBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      name
      cif
      date
      address
      phone
      email
      web
      image
    }
  }
  `)
