import gql from 'graphql-tag'

export default gql(`
  mutation createEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      businessId
      name
      nif
      image
    }
  }
  `)
