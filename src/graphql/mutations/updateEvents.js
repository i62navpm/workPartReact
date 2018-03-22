import gql from 'graphql-tag'

export default gql(`
  mutation updateEvents($input: UpdateEventsInput!) {
    updateEvents(input: $input) {
      id
      employeeId
    }
  }
  `)
