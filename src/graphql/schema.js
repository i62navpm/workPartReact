import { DateTime } from 'luxon'
import imageBusiness from '../assets/images/businessDefault.png'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} from 'graphql'

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
    image: { type: GraphQLString }
  }
})

const businessData = [
  {
    id: '1',
    name: 'Business example 1',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    cif: 'X14111211',
    address: 'Company address1',
    phone: '110000000',
    email: 'company1@email.com',
    web: 'http://www.companyweb1.com',
    image: imageBusiness
  },
  {
    id: '2',
    name: 'New business example 2',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    cif: 'X14111222',
    address: 'Company address2',
    phone: '220000000',
    email: 'company2@email.com',
    web: 'http://www.companyweb2.com',
    image: imageBusiness
  },
  {
    id: '3',
    name: 'Example business 3',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    cif: 'X14111223',
    address: 'Company address3',
    phone: '330000000',
    email: 'company3@email.com',
    web: 'http://www.companyweb3.com',
    image: imageBusiness
  }
]

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
    }
  }
})

export const schema = new GraphQLSchema({ query: QueryType })
