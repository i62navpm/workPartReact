import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLoader } from '../../actions/loader'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Typography, Hidden } from 'material-ui'
import { withStyles } from 'material-ui/styles'
import { DateTime } from 'luxon'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const styles = theme => ({
  titleSummary: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  }
})

function calcChart(data, date = new Date()) {
  let daysMonth = daysInMonth(date)
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
    return [
      rest.name,
      (payEvents.data.money || 0),
      (debtEvents.data.money || 0)
    ]
  })
}

function daysInMonth(date) {
  date = DateTime.fromISO(new Date(date).toISOString())
  let monthDate = date.startOf('month')

  return Array(monthDate.daysInMonth)
    .fill()
    .map((_, i) => ({
      name: monthDate.plus({ days: i }).toLocaleString(DateTime.DATE_HUGE),
      date: monthDate.plus({ days: i })
    }))
}

function calcTotalRow(rows) {
  return rows.reduce((bef, curr) => {
    const [title, pay1, debt1] = bef
    const [, pay2, debt2] = curr
    return [title, pay1 + pay2, debt1 + debt2]
  }, ['Sum:   ', 0, 0])
}

function createTables(doc, employee) {
  return {
    createMainTable(rows, columns, date) {
      doc.setTextColor('#3f51b5')
      doc.text(employee.name, 15, 20)
      doc.setFontSize(18)
      doc.text(`Paysheet ${DateTime.fromISO(new Date(date).toISOString()).toLocaleString({ month: 'long' })}`, 110, 30)
      doc.setFontSize(10)
      doc.setTextColor()
      doc.text(`Nif: ${employee.nif}`, 15, 30)
      doc.text(`Address: ${employee.address}`, 15, 35)
      doc.text(`Phone: ${employee.phone}`, 15, 40)
      doc.text(`Email: ${employee.email}`, 15, 45)
      doc.setFontSize(16)

      doc.autoTable(columns, rows, {
        theme: 'striped', startY: 50, bodyStyles: { fontSize: 8 }, margin: { horizontal: 30 },
        drawCell: (cell, data) => {
          if (data.row.index === data.table.rows.length - 1) {
            doc.setFontSize(12)
            doc.setFontStyle('bold')
          }
        },
        drawRow: function (row, data) {
          if (row.index === data.table.rows.length - 1) {
            const title = row.cells['0']
            const totalPay = row.cells['1']
            const totalDebt = row.cells['2']

            data.row.height = 8
            title.styles.halign = 'right'
            totalPay.styles.textColor = '#4caf50'
            totalDebt.styles.textColor = '#e91e63'
          }
        },
      })
    },
    createTotalTable(totalAdd) {
      const options = {
        theme: 'grid', startY: doc.autoTableEndPosY() + 5, bodyStyles: { fontSize: 10 }, margin: { horizontal: 80 },
        drawCell: (cell, data) => {
          if (data.row.index === data.table.rows.length - 1) {
            doc.setFontSize(12)
            doc.setFontStyle('bold')
          }
        },
        drawRow: function (row, data) {
          if (row.index === data.table.rows.length - 1) {
            const title = row.cells['0']

            data.row.height = 8
            title.styles.halign = 'center'
            title.styles.textColor = title.raw.includes('-') ? '#e91e63' : '#4caf50'
          }
        }
      }

      const [, totalPay, totalDebt] = totalAdd
      const total = [`${totalPay - totalDebt} €`]
      doc.autoTable(['Total'], [total], options)
    }
  }
}

class PdfSummary extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { classes } = props
    this.classes = classes

    const { loading, employeeEvents, ...data } = props.data

    this.state = {
      currentDate: new Date(),
      loading,
      employeeEvents,
      data
    }
  }

  createPdf(employeeEvents) {
    this.doc = new jsPDF()
    this.doc.setProperties({
      title: 'Employee summary'
    })
    this.columns = ['Date', 'Pay', 'Debt']
    this.createTablesFn = createTables(this.doc, this.props.employee)
    
    let rows = calcChart(employeeEvents, this.state.currentDate)

    const totalAdd = calcTotalRow(rows)

    rows = [...rows, totalAdd].map(([date, pay, debt]) => ([date, pay + ' €', debt + ' €']))

    this.createTablesFn.createMainTable(rows, this.columns, this.state.currentDate)
    this.createTablesFn.createTotalTable(totalAdd)
  }

  componentWillReceiveProps(nextProps) {
    const { data: { employeeEvents, loading } } = nextProps

    this.setState({ loading, employeeEvents })
    this.createPdf(employeeEvents)
    this.props.setLoader(loading)
  }

  render() {
    const { loading } = this.state

    if (loading) return null

    return (
      <React.Fragment>
        <Hidden xsDown>
          <Typography className={this.props.classes.titleSummary} align="center" type="headline" color="primary">
            Employee Summary
          </Typography>
          <iframe title="Summary employee pdf" src={this.doc.output('datauristring')} type="application/pdf" width="100%" height="842px" />
        </Hidden>
      </React.Fragment>
    )
  }

}

PdfSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  employee: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => {
  return {
    setLoader: loading => dispatch(setLoader({ loading }))
  }
}

export default graphql(gql`
  fragment EventPart on Event {
    data {
      title,
      salary,
      money
    },
    allDay,
    start,
    end
  }
  query getEvents($companyId: ID, $employeeId: ID, $date: String) {
    employeeEvents(companyId: $companyId, employeeId: $employeeId, date: $date) {
      pay {
        ...EventPart
      },
      debt {
        ...EventPart
      }
    }
  }
  `, {
    options: () => {
      return { variables: { companyId: '2', employeeId: '1', date: new Date().toISOString() } }
    }
  })(
    connect(
      null,
      mapDispatchToProps
    )(withStyles(styles)(PdfSummary))
  )
