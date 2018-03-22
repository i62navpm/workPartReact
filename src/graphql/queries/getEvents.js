import gql from 'graphql-tag'

export default gql(`
  fragment EventPart on EventData{
    title,
    salary,
    money
    allDay,
    start,
    end
  }
  query($id: ID! $employeeId: ID!) {
    getEvents(id: $id employeeId: $employeeId) {
      id
      employeeId
      pay {
        ...EventPart
      },
      debt {
        ...EventPart
      }
    }
  }
  `)
