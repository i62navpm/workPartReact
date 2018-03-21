import gql from 'graphql-tag'

export default gql(`
  query($employeeId: ID! $yearId: Int!) {
    getEventsByEmployeeIdIndexByYear(employeeId: $employeeId yearId: $yearId) {
      items {
        pay {
          money
          start
        }
        debt {
          money
          start
        }
      }
      
    }
  }
  `)
