import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts'

const styles = () => ({
})

class MonthPieChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.calcChart(this.props.data)
    }
  }

  calcChart(data) {
    const dataPay = { name: 'pay', color: '#4caf50' }
    const dataDebt = { name: 'debt', color: '#e91e63' }

    dataPay.value = data.pay.reduce((bef, curr) => ({ money: (curr.money || 0) + (bef.money || 0) } ), { money: 0 } ).money
    dataDebt.value = data.debt.reduce((bef, curr) => ({ money: (curr.money || 0) + (bef.money || 0) } ), { money: 0 } ).money
    return [dataPay, dataDebt]
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.calendarChanged !== this.props.calendarChanged) {
      this.setState({ data: this.calcChart(nextProps.data)})
    }
  }

  render() {
    return (
      <ResponsiveContainer>
        <PieChart margin={{ right: 50, left: 50 }}>
          <Pie dataKey="value" data={this.state.data} fill="#8884d8" label>
            {this.state.data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }
}

MonthPieChart.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(MonthPieChart)