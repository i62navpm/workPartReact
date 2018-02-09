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

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: {
    title: { type: GraphQLString },
    allDay: { type: GraphQLBoolean },
    start: { type: GraphQLString },
    end: { type: GraphQLString }
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
    events: { type: new GraphQLList(EventType) }
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
