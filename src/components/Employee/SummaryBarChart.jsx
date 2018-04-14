import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { translate } from 'react-i18next'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DateTime, Info } from 'luxon'
import i18n from './../../i18n'
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
    const months = Info.months('long', { locale: i18n.language }).reduce((obj, item) => {
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
    return Info.months('long', { locale: i18n.language })
      .map(month => ({ name: month, pay: 0, debt: 0 }))
      .map(({ name }) => ({ name, [this.props.t('Pay')]: months[name]['pay'], [this.props.t('Debt')]: months[name]['debt'] }))
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
          <Bar type="monotone" dataKey={this.props.t('Pay')} fill="#4caf50" />
          <Bar type="monotone" dataKey={this.props.t('Debt')} fill="#e91e63" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

SummaryBarChart.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
}

export default withStyles(styles)(translate('translations')(SummaryBarChart))