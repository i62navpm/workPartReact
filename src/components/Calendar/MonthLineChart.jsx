import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { DateTime } from 'luxon'

const styles = () => ({})

class MonthLineChart extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentDate: this.props.currentDate,
      data: this.calcChart(this.props.data)
    }
  }

  calcChart (data, date = new Date()) {
    let daysMonth = this.daysInMonth(date)
    const format = { month: 'numeric', day: 'numeric', year: 'numeric' }

    return daysMonth.map(({ date, ...rest }) => {
      let payEvents = data.pay.find(({ start }) => {
        start = DateTime.fromISO(new Date(start).toISOString())
        return start.toLocaleString(format) === date.toLocaleString(format)
      })

      let debtEvents = data.debt.find(({ start }) => {
        start = DateTime.fromISO(new Date(start).toISOString())
        return start.toLocaleString(format) === date.toLocaleString(format)
      })

      if (!payEvents) payEvents = { data: {} }
      if (!debtEvents) debtEvents = { data: {} }
      return {
        ...rest,
        pay: payEvents.data.money || 0,
        debt: debtEvents.data.money || 0
      }
    })
  }

  daysInMonth (date) {
    date = DateTime.fromISO(new Date(date).toISOString())
    let monthDate = date.startOf('month')

    return Array(monthDate.daysInMonth)
      .fill()
      .map((_, i) => ({
        name: `${i + 1}-${date.toLocaleString({ month: 'short' })}`,
        date: monthDate.plus({ days: i })
      }))
  }

  componentWillReceiveProps (nextProps) {
    const format = { month: 'numeric', day: 'numeric', year: 'numeric' }
    const next = DateTime.fromISO(new Date(nextProps.currentDate).toISOString())
    const current = DateTime.fromISO(
      new Date(this.state.currentDate).toISOString()
    )

    if (
      next.toLocaleString(format) !== current.toLocaleString(format) ||
      nextProps.calendarChanged !== this.props.calendarChanged
    ) {
      this.setState({
        data: this.calcChart(nextProps.data, nextProps.currentDate),
        currentDate: nextProps.currentDate
      })
    }
  }

  render () {
    return (
      <ResponsiveContainer>
        <LineChart data={this.state.data}>
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
