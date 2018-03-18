import gql from 'graphql-tag'

export default gql(`
  query($id: ID!, $businessId: ID!){
    getEmployee(id: $id, businessId: $businessId) {
      id
      businessId
      name
      nif
      address
      phone
      email
      description
      image
      fullSalary
      halfSalary
    }
  }
  `)
