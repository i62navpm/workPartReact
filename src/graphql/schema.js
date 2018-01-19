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
    date: { type: GraphQLString },
    image: { type: GraphQLString }
  }
})

const businessData = [
  {
    id: '1',
    name: 'Business example 1',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    image: imageBusiness
  },
  {
    id: '2',
    name: 'New business example 2',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    image: imageBusiness
  },
  {
    id: '3',
    name: 'Example business 3',
    date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
    image: imageBusiness
  }
]

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    business: {
      type: new GraphQLList(BusinessType),
      resolve: () => businessData
    }
  }
})

export const schema = new GraphQLSchema({ query: QueryType })
