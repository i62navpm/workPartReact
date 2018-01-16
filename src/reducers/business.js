import { DateTime } from 'luxon'
import imageBusiness from '../assets/images/businessDefault.png'

const initialState = [
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

const business = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default business
