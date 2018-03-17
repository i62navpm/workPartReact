import gql from 'graphql-tag'

export default gql(`
  mutation updateBusiness($input: UpdateBusinessInput!) {
    updateBusiness(input: $input) {
      id
      userId
      name
      cif
      date
      image
    }
  }
  `)
