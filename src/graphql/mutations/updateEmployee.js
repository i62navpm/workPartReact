import gql from 'graphql-tag'

export default gql(`
  mutation updateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      id
      businessId
      name
      nif
      image
    }
  }
  `)
