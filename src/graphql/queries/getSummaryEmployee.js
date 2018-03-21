import gql from 'graphql-tag'

export default gql(`
  query($id: ID! $businessId: ID! $yearId: Int!){
    getEmployee(id: $id, businessId: $businessId) {
      id
      name
      nif
      address
      phone
      email
      description
      image
    }
    
    getEventsByEmployeeIdIndexByYear(employeeId: $id yearId: $yearId) {
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
