import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DateTime, Info } from 'luxon'

const styles = () => ({
})

class SummaryBarChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.calcChart(this.props.data)
    }

  }

  calcChart(data) {
    const months = Info.months('long', { locale: 'en-gb' }).reduce((obj, item) => {
      obj[item] = { pay: 0, debt: 0 }
      return obj
    }, {})

    data = data.reduce((bef, curr) => {
      let {pay, debt} = bef
      bef.pay = [...pay, ...curr.pay]
      bef.debt = [...debt, ...curr.debt]
      return bef
    }, {pay: [], debt: []})

    data.pay.forEach(({ start, money }) => {
      start = DateTime.fromISO(new Date(start).toISOString())
      months[start.toLocaleString({ month: 'long' })]['pay'] += money
    })
    data.debt.forEach(({ start, money }) => {
      start = DateTime.fromISO(new Date(start).toISOString())
      months[start.toLocaleString({ month: 'long' })]['debt'] += money
    })
    return Info.months('long', { locale: 'en-gb' })
      .map(month => ({ name: month, pay: 0, debt: 0 }))
      .map(({ name }) => ({ name, pay: months[name]['pay'], debt: months[name]['debt'] }))
  }

  render() {
    return (
      <ResponsiveContainer>
        <BarChart data={this.state.data} >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar type="monotone" dataKey="pay" fill="#4caf50" />
          <Bar type="monotone" dataKey="debt" fill="#e91e63" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

SummaryBarChart.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
}

export default withStyles(styles)(SummaryBarChart)