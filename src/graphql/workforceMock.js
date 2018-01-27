import { DateTime } from 'luxon'
import imageEmployee from '../assets/images/employeeDefault.jpg'

export default [
  {
    id: '1',
    name: 'Employee example 1',
    nif: '14111211X',
    address: 'Employee address1',
    phone: '110000000',
    email: 'employee1@email.com',
    image: imageEmployee,
    fullSalary: 45.5,
    halfSalary: 25
  },
  {
    id: '2',
    name: 'New employee example 2',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    nif: '14111222X',
    address: 'Employee address2',
    phone: '220000000',
    email: 'employee2@email.com',
    image: imageEmployee,
    fullSalary: 45.5,
    halfSalary: 25
  },
  {
    id: '3',
    name: 'Example employee 3',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    nif: '14111223X',
    address: 'Employee address3',
    phone: '330000000',
    email: 'employee3@email.com',
    image: imageEmployee,
    fullSalary: 45.5,
    halfSalary: 25
  }
]
