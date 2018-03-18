import gql from 'graphql-tag'

export default gql(`
  query($id: ID!, $userId: ID!){
    getBusiness(id: $id, userId: $userId) {
      id
      name
      cif
      image 
      employees {
        items {
          id
          name
          image
          fullSalary
          halfSalary
        }
      }
    }
  }
  `)
