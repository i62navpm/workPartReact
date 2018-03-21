import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLoader } from '../../actions/loader'
import { setNotification } from '../../actions/notification'
import { graphql, compose } from 'react-apollo'
import { Typography, Hidden, TextField, Button } from 'material-ui'
import { FileDownload } from 'material-ui-icons'
import { withStyles } from 'material-ui/styles'
import { DateTime } from 'luxon'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { calcChart, calcTotalRow } from '../../utils/calendar.service'
import { createTables } from '../../utils/pdf.service'
import getEvents from '../../graphql/queries/getEvents'
import { getFirstDayMonth } from '../../utils/calendar.service'

const styles = theme => ({
  titleSummary: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2
  },
  searchDate: {
    float: 'left',
    marginBottom: theme.spacing.unit * 4
  },
  downloadButton: {
    marginTop: theme.spacing.unit * 2
  }
})

class PdfSummary extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { classes } = props
    this.classes = classes

    const { loading, getEvents, ...data } = props.data

    this.currentDate = new Date()
    this.state = {
      currentDate: new Date(),
      loading,
      events: getEvents,
      ...data
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

    let rows = calcChart(employeeEvents, this.currentDate)

    const totalAdd = calcTotalRow(rows)

    rows = [...rows, totalAdd].map(([date, pay, debt]) => ([date, pay + ' €', debt + ' €']))

    this.createTablesFn.createMainTable(rows, this.columns, this.currentDate)
    this.createTablesFn.createTotalTable(totalAdd)
  }

  componentWillReceiveProps(nextProps) {
    let { data: { getEvents, loading } } = nextProps

    if (!getEvents) getEvents = { pay: [], debt: [] }
    if (!loading) this.createPdf(getEvents)
    
    this.setState({ loading, getEvents })
    this.props.setLoader(loading)
  }

  fetchEvents(date) {
    return this.state.fetchMore({
      variables: { employeeId: this.props.employee.id, id: getFirstDayMonth(date) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        this.currentDate = date
        if (!previousResult.getEvents && !fetchMoreResult.getEvents) {
          const getEvents = { pay: [], debt: [] }
          this.createPdf({ pay: [], debt: [] })
          this.setState({ data: { ...this.state.getEvents.data, getEvents } })
        }
        return fetchMoreResult
      }
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
        <Hidden smUp>
          <Button onClick={() => this.doc.save(`${this.props.employee.name}-${this.getSearchDate()}.pdf`)} raised className={this.props.classes.downloadButton} color="primary" size="small">
            <FileDownload />
            Download
          </Button>
        </Hidden>
      </React.Fragment>
    )
  }

}

PdfSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  employee: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification = {}) => dispatch(setNotification(notification)),
    setLoader: (loading) => dispatch(setLoader({ loading }))
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(compose(
  graphql(getEvents, {
    options: ({ employee: { id } }) => ({
      variables: { employeeId: id, id: getFirstDayMonth(new Date()) },
      fetchPolicy: 'network-only'
    }),
  })
)(withStyles(styles)(PdfSummary)))
)
