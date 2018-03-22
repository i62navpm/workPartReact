import gql from 'graphql-tag'

export default gql(`
  mutation createEvents($input: CreateEventsInput!) {
    createEvents(input: $input) {
      id
      employeeId
    }
  }
  `)
