import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { withStyles } from 'material-ui/styles'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import Calendar from '../Calendar'
import MonthLineChart from '../Calendar/MonthLineChart'
import MonthPieChart from '../Calendar/MonthPieChart'
import { Typography, Avatar, IconButton, Grid, Paper, Hidden } from 'material-ui'
import Tabs, { Tab } from 'material-ui/Tabs'
import { ExpandMore, Edit, TrendingUp, TrendingDown, Warning, PermContactCalendar } from 'material-ui-icons'
import { setNotification } from '../../actions/notification'
import { setLoader } from '../../actions/loader'

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 2.5,
    marginLeft: theme.spacing.unit * 2
  },
  blockCharts: {
    marginTop: 56
  },
  monthLineChart: {
    height: '250px'
  },
  iconWarning: {
    marginLeft: 'auto'
  },
  icon: {
    width: 20,
    height: 20
  },
  tab: {
    maxWidth: '100%'
  },
  warning: {
    fill: '#ffc107',
    width: 20,
    height: 20
  }
})

class EmployeeCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    this.mapModality = {
      0: 'pay',
      1: 'debt'
    }

    const { data, employee } = props

    this.state = {
      modality: 0,
      initialEvents: null,
      events: {},
      employee,
      calendarChanged: { pay: false, debt: false },
      discardChanges: false,
      ...data
    }

    this.changeModality = this.changeModality.bind(this)
    this.updateCalendar = this.updateCalendar.bind(this)
    this.onChangeCalendar = this.onChangeCalendar.bind(this)
    this.restoreEvents = this.restoreEvents.bind(this)
    this.saveEvents = this.saveEvents.bind(this)
    this.fetchEvents = this.fetchEvents.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { data: { loading, employeeEvents } } = nextProps
    if (!this.state.initialEvents) this.setState({ initialEvents: employeeEvents })
    this.setState({ loading, events: employeeEvents, discardChanges: !this.state.discardChanges })
    this.props.setLoader(loading)
  }

  fetchEvents(date) {
    return this.state.fetchMore({
      variables: { date: date.toISOString() },
      updateQuery: (previousResult, { fetchMoreResult }) => fetchMoreResult
    })
  }

  changeModality(event, value) {
    this.setState({ modality: value })
  }

  updateCalendar(calendarUpdated) {
    this.setState({ events: { ...this.state.events, ...calendarUpdated } })
  }

  onChangeCalendar() {
    this.setState({ calendarChanged: { ...this.state.calendarChanged, [this.mapModality[this.state.modality]]: true } })
  }

  restoreEvents() {
    this.setState({
      events: {
        ...this.state.events, [this.mapModality[this.state.modality]]: this.state.initialEvents[this.mapModality[this.state.modality]]
      },
      calendarChanged: {
        ...this.state.calendarChanged, [this.mapModality[this.state.modality]]: false
      },
      discardChanges: !this.state.discardChanges
    })
  }

  saveEvents(events) {
    this.setState({
      initialEvents: {
        ...this.state.initialEvents, [this.mapModality[this.state.modality]]: events
      },
      events: {
        ...this.state.events, [this.mapModality[this.state.modality]]: events
      },
      calendarChanged: {
        ...this.state.calendarChanged, [this.mapModality[this.state.modality]]: false
      },
      discardChanges: !this.state.discardChanges
    })
    this.props.setNotification({
      open: true,
      type: 'success',
      message: 'Calendar saved correctly!'
    })
  }

  showWarning() {
    return Object.values(this.state.calendarChanged).some(status => status === true)
      ? <IconButton>
        <Warning className={this.props.classes.warning} />
      </IconButton>
      : null
  }

  render() {
    let { loading } = this.state

    if (loading) return null

    return (
      <div className={this.props.classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Avatar alt={this.props.employee.name} src={this.props.employee.image} />
            <Typography className={this.props.classes.heading}>
              {this.props.employee.name}
            </Typography>
            <div className={this.props.classes.iconWarning}>
              {this.showWarning()}
            </div>
            <Link
              to={`/worksheet/${this.props.companyId}/summary/${
                this.props.employee.id
                }`}
            >
              <IconButton>
                <PermContactCalendar className={this.props.classes.icon} />
              </IconButton>
            </Link>
            <Link
              to={`/worksheet/${this.props.companyId}/employee/${
                this.props.employee.id
                }`}
            >
              <IconButton>
                <Edit className={this.props.classes.icon} />
              </IconButton>
            </Link>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Paper>
                  <Tabs
                    value={this.state.modality}
                    onChange={this.changeModality}
                    indicatorColor="accent"
                    textColor="accent"
                    fullWidth
                  >
                    <Tab
                      className={this.props.classes.tab}
                      icon={this.state.calendarChanged['pay'] ? <Warning className={this.props.classes.warning} /> : <TrendingUp />}
                      label="Pay"
                    />
                    <Tab
                      className={this.props.classes.tab}
                      icon={this.state.calendarChanged['debt'] ? <Warning className={this.props.classes.warning} /> : <TrendingDown />}
                      label="Debt"
                    />
                  </Tabs>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Calendar
                  data={{
                    employeeInfo: this.state.employee,
                    events: this.state.events[this.mapModality[this.state.modality]],
                    modality: this.mapModality[this.state.modality],
                    discardChanges: this.state.discardChanges,
                    calendarChanged: this.state.calendarChanged,
                  }}
                  updateCalendar={this.updateCalendar}
                  onChangeCalendar={this.onChangeCalendar}
                  restoreEvents={this.restoreEvents}
                  saveEvents={this.saveEvents}
                  fetchEvents={this.fetchEvents}
                />
              </Grid>
              <Hidden xsDown>
                <Grid item xs={4} className={this.props.classes.blockCharts}>
                  <Grid container>
                    <Grid item xs={12} className={this.props.classes.monthLineChart}>
                      <MonthLineChart data={this.state.events} calendarChanged={this.state.discardChanges} />
                    </Grid>
                    <Grid item xs={12} className={this.props.classes.monthLineChart}>
                      <MonthPieChart data={this.state.events} calendarChanged={this.state.discardChanges} />
                    </Grid>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div >
    )
  }
}

EmployeeCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  employee: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification = {}) => dispatch(setNotification(notification)),
    setLoader: (loading) => dispatch(setLoader({ loading }))
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
    options: ({ employee, companyId }) => {
      return { variables: { companyId, employeeId: employee.id, date: new Date().toISOString() } }
    }
  })(
    connect(
      null,
      mapDispatchToProps
    )(withStyles(styles)(EmployeeCalendar))
  )