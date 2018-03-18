import gql from 'graphql-tag'

export default gql(`
  mutation deleteEmployee($input: DeleteEmployeeInput!) {
    deleteEmployee(input: $input) {
      id
    }
  }
  `)
