import { pay, debt } from './eventsMock'
import imageEmployee from '../assets/images/employeeDefault.jpg'

export default [
  {
    id: '1',
    name: 'Employee example 1',
    nif: '14111211X',
    address: 'Employee address1',
    phone: '110000000',
    email: 'employee1@email.com',
    description: 'This is the employee1 description',
    image: imageEmployee,
    fullSalary: 45.5,
    halfSalary: 25,
    events: {
      pay: [pay[0], pay[1]],
      debt: [debt[0]]
    }
  },
  {
    id: '2',
    name: 'New employee example 2',
    nif: '14111222X',
    address: 'Employee address2',
    phone: '220000000',
    email: 'employee2@email.com',
    description: 'This is the employee2 description',
    image: imageEmployee,
    fullSalary: 45.5,
    halfSalary: 25,
    events: {
      pay,
      debt
    }
  },
  {
    id: '3',
    name: 'Example employee 3',
    nif: '14111223X',
    address: 'Employee address3',
    phone: '330000000',
    email: 'employee3@email.com',
    description: 'This is the employee3 description',
    image: imageEmployee,
    fullSalary: 45.5,
    halfSalary: 25,
    events: {
      pay: [pay[2]],
      debt: [debt[0]]
    }
  }
]
