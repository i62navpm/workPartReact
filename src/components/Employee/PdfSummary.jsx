import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLoader } from '../../actions/loader'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Typography, Hidden, TextField } from 'material-ui'
import { withStyles } from 'material-ui/styles'
import { DateTime } from 'luxon'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { calcChart, calcTotalRow } from '../../utils/calendar.service'
import { createTables } from '../../utils/pdf.service'

const styles = theme => ({
  titleSummary: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2
  },
  searchDate: {
    float: 'left',
    marginBottom: theme.spacing.unit * 4
  }
})

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

    this.changeSearchDate = this.changeSearchDate.bind(this)
    this.fetchEvents = this.fetchEvents.bind(this)
  }

  getSearchDate() {
    return DateTime.fromISO(new Date(this.state.currentDate).toISOString()).toISODate()
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

    this.createPdf(employeeEvents)
    this.setState({ loading, employeeEvents })
    this.props.setLoader(loading)
  }

  fetchEvents(date) {
    this.setState({ currentDate: date })
    return this.state.data.fetchMore({
      variables: { date: date.toISOString() },
      updateQuery: (previousResult, { fetchMoreResult }) => fetchMoreResult
    })
  }

  async changeSearchDate(e) {
    e.stopPropagation()
    await this.fetchEvents(new Date(e.target.value))
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
          <TextField
            label="Search date"
            type="date"
            className={this.props.classes.searchDate}
            onChange={this.changeSearchDate}
            defaultValue={this.getSearchDate()}
            InputLabelProps={{
              shrink: true,
            }}
          />
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
    options: ({ companyId, employee }) => ({ variables: { companyId, employeeId: employee.id, date: new Date().toISOString() } })
  })(
    connect(
      null,
      mapDispatchToProps
    )(withStyles(styles)(PdfSummary))
  )
