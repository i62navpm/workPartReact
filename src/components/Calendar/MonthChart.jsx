import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DateTime } from 'luxon'

const styles = () => ({
})

class MonthChart extends React.Component {
  constructor(props) {
    super(props)

    let daysMonth = this.daysInMonth()

    this.data = daysMonth.map(({ date, ...rest }) => {
      let payEvents = this.props.data.pay.find(({ start }) => {
        start = DateTime.fromISO(new Date(start).toISOString())
        return start.toLocaleString() === date.toLocaleString()
      })

      let debtEvents = this.props.data.debt.find(({ start }) => {
        start = DateTime.fromISO(new Date(start).toISOString())
        return start.toLocaleString() === date.toLocaleString()
      })

      if (!payEvents) payEvents = { data: {} }
      if (!debtEvents) debtEvents = { data: {} }
      return { ...rest, pay: payEvents.data.money || 0, debt: debtEvents.data.money || 0 }
    })
  }

  daysInMonth() {
    let monthDate = DateTime.local().startOf('month')

    return Array(monthDate.daysInMonth).fill().map((_, i) => ({
      name: `${i + 1}-${monthDate.toLocaleString({ month: 'short' })}`,
      date: monthDate.plus({ days: i })
    }))

  }

  render() {
    return (
      <ResponsiveContainer>
        <LineChart data={this.data} >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pay" stroke="#8884d8" />
          <Line type="monotone" dataKey="debt" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

MonthChart.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(MonthChart)