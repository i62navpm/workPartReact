import React from 'react'
import PropTypes from 'prop-types'
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

function createTables(doc, props) {
  return {
    createMainTable(rows, columns, date) {
      doc.setTextColor('#3f51b5')
      doc.text(props.data.name, 15, 20)
      doc.setFontSize(18)
      doc.text(`Paysheet ${DateTime.fromISO(new Date(date).toISOString()).toLocaleString({ month: 'long' })}`, 110, 30)
      doc.setFontSize(10)
      doc.setTextColor()
      doc.text(`Nif: ${props.data.nif}`, 15, 30)
      doc.text(`Address: ${props.data.address}`, 15, 35)
      doc.text(`Phone: ${props.data.phone}`, 15, 40)
      doc.text(`Email: ${props.data.email}`, 15, 45)
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

function PdfSummary(props) {
  let doc = new jsPDF()
  let date = new Date(2018, 1, 1)
  
  doc.setProperties({
    title: 'Employee summary'
  })
  
  var columns = ['Date', 'Pay', 'Debt']
  var rows = calcChart(props.data.events, date)

  const totalAdd = calcTotalRow(rows)

  rows = [...rows, totalAdd].map(([date, pay, debt]) => ([date, pay + ' €', debt + ' €']))

  let createTablesFn = createTables(doc, props)
  createTablesFn.createMainTable(rows, columns, date)
  createTablesFn.createTotalTable(totalAdd)

  return (
    <React.Fragment>
      <Hidden xsDown>
        <Typography className={props.classes.titleSummary} align="center" type="headline" color="primary">
          Employee Summary
      </Typography>
        <iframe title="Summary employee pdf" src={doc.output('datauristring')} type="application/pdf" width="100%" height="842px" />
      </Hidden>
    </React.Fragment>
  )
}

PdfSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(PdfSummary)