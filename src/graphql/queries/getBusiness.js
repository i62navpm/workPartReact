import gql from 'graphql-tag'

export default gql(`
  query($id: ID!, $userId: ID!){
    getBusiness(id: $id, userId: $userId) {
      id
      name
      cif
      address
      phone
      email
      web
      image
    }
  }
  `)
