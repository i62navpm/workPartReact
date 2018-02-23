import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DateTime } from 'luxon'

const styles = () => ({
})

class MonthLineChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.calcChart(this.props.data)
    }

  }

  calcChart(data) {
    let daysMonth = this.daysInMonth()

    return daysMonth.map(({ date, ...rest }) => {
      let payEvents = data.pay.find(({ start }) => {
        start = DateTime.fromISO(new Date(start).toISOString())
        return start.toLocaleString() === date.toLocaleString()
      })

      let debtEvents = data.debt.find(({ start }) => {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.calendarChanged !== this.props.calendarChanged) {
      this.setState({ data: this.calcChart(nextProps.data) })
    }
  }

  render() {
    return (
      <ResponsiveContainer>
        <LineChart data={this.state.data} >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pay" stroke="#4caf50" />
          <Line type="monotone" dataKey="debt" stroke="#e91e63" />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

MonthLineChart.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(MonthLineChart)