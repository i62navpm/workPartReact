import businessData from './businessMock'
import workforceData from './workforceMock'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLBoolean
} from 'graphql'

const DataEventType = new GraphQLObjectType({
  name: 'DataEvent',
  fields: {
    title: { type: GraphQLString },
    salary: { type: GraphQLString },
    money: { type: GraphQLFloat }
  }
})

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: {
    data: { type: DataEventType },
    allDay: { type: GraphQLBoolean },
    start: { type: GraphQLString },
    end: { type: GraphQLString }
  }
})

const EventModalityType = new GraphQLObjectType({
  name: 'EventModality',
  fields: {
    pay: { type: new GraphQLList(EventType) },
    debt: { type: new GraphQLList(EventType) }
  }
})

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    nif: { type: GraphQLString },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    fullSalary: { type: GraphQLFloat },
    halfSalary: { type: GraphQLFloat },
    events: { type: EventModalityType }
  }
})

const BusinessType = new GraphQLObjectType({
  name: 'Business',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cif: { type: GraphQLString },
    date: { type: GraphQLString },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    web: { type: GraphQLString },
    image: { type: GraphQLString },
    workforce: { type: new GraphQLList(EmployeeType) }
  }
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    business: {
      type: new GraphQLList(BusinessType),
      resolve: () => businessData
    },
    company: {
      type: BusinessType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (root, args) =>
        businessData.find(company => company.id === args.id)
    },
    employeeEvents: {
      type: EventModalityType,
      args: {
        companyId: { type: GraphQLID },
        employeeId: { type: GraphQLID },
        date: { type: GraphQLString }
      },
      resolve: (root, args) => {
        let { workforce } = businessData.find(
          company => company.id === args.companyId
        )
        let { events } = workforce.find(
          employee => employee.id === args.employeeId
        )

        let { pay, debt } = events

        const filterFn = item =>
          new Date(args.date).getMonth() === new Date(item.end).getMonth() &&
          new Date(args.date).getYear() === new Date(item.end).getYear()

        pay = pay.filter(filterFn)
        debt = debt.filter(filterFn)

        return { pay, debt }
      }
    },
    employeeSummary: {
      type: EmployeeType,
      args: {
        companyId: { type: GraphQLID },
        employeeId: { type: GraphQLID },
        date: { type: GraphQLString }
      },
      resolve: (root, args) => {
        let { workforce } = businessData.find(
          company => company.id === args.companyId
        )
        let { events, ...employee } = workforce.find(
          employee => employee.id === args.employeeId
        )

        let { pay, debt } = events
        const year = new Date(args.date).getYear()

        const filterFn = item => year === new Date(item.end).getYear()

        pay = pay.filter(filterFn)
        debt = debt.filter(filterFn)

        return { ...employee, events: { pay, debt } }
      }
    },
    workforce: {
      type: new GraphQLList(EmployeeType),
      resolve: () => workforceData
    },
    employee: {
      type: EmployeeType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (root, args) =>
        workforceData.find(employee => employee.id === args.id)
    }
  }
})

export const schema = new GraphQLSchema({ query: QueryType })
