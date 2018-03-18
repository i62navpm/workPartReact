import gql from 'graphql-tag'

export default gql(`
  fragment EventPart on EventInfo{
    title,
    salary,
    money
    allDay,
    start,
    end
  }
  query($employeeId: ID!) {
    queryEventsByEmployeeIdIndex(employeeId: $employeeId) {
      items {
        pay {
          ...EventPart
        },
        debt {
          ...EventPart
        }
      }
    }
  }
  `)
