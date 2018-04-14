import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
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
import { ExpandMore, Edit, TrendingUp, TrendingDown, Warning, FolderShared } from 'material-ui-icons'
import { translate } from 'react-i18next'
import { setNotification } from '../../actions/notification'
import { setLoader } from '../../actions/loader'
import imageEmployee from '../../assets/images/employeeDefault.jpg'
import getEvents from '../../graphql/queries/getEvents'
import createEvents from '../../graphql/mutations/createEvents'
import updateEvents from '../../graphql/mutations/updateEvents'
import { getFirstDayMonth } from '../../utils/calendar.service'

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
      currentDate: new Date(),
      discardChanges: false,
      ...data
    }

    this.changeModality = this.changeModality.bind(this)
    this.updateCalendar = this.updateCalendar.bind(this)
    this.onChangeCalendar = this.onChangeCalendar.bind(this)
    this.restoreEvents = this.restoreEvents.bind(this)
    this.saveEvents = this.saveEvents.bind(this)
    this.fetchEvents = this.fetchEvents.bind(this)
    this.createEvents = this.createEvents.bind(this)
    this.updateEvents = this.updateEvents.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    let { data: { loading, getEvents } } = nextProps

    if (!getEvents) getEvents = { employeeId: this.props.employee.id, pay: [], debt: [] }

    if (!loading && getEvents.employeeId === this.props.employee.id)
      this.setState({ loading, events: getEvents, initialEvents: getEvents, discardChanges: !this.state.discardChanges })

    this.props.setLoader(loading)
  }

  fetchEvents(date) {
    this.setState({ currentDate: date })
    return this.state.fetchMore({
      variables: { employeeId: this.props.employee.id, id: getFirstDayMonth(date) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult.getEvents) {
          const getEvents = { employeeId: this.props.employee.id, pay: [], debt: [] }
          return this.componentWillReceiveProps({ data: { getEvents } })
        }
        return fetchMoreResult
      }
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

  omitTypename(key, value) {
    return (key === '__typename' || !value)
      ? undefined
      : value
  }

  removeNull(obj) {
    return JSON.parse(JSON.stringify(obj), this.omitTypename)
  }

  createEvents(data) {
    this.props.setLoader(true)

    data = this.removeNull({ ...data })
    return this.props.createEvents({
      variables: { input: data },
      update: (proxy, { data: { createEvents } }) => {
        this.props.data.getEvents = { ...createEvents }
        this.props.setLoader(false)
      }
    })
  }

  async updateEvents(data) {
    this.props.setLoader(true)

    data = this.removeNull({ ...data })
    return this.props.updateEvents({ variables: { input: data } }).then(
      () => this.props.setLoader(false)
    )
  }

  async saveEvents(events) {
    const fn = (this.state.initialEvents.pay.length || this.state.initialEvents.debt.length) ? this.updateEvents : this.createEvents
    try {
      await fn({ employeeId: this.props.employee.id, id: getFirstDayMonth(this.state.currentDate), yearId: this.state.currentDate.getFullYear(), ...this.state.events, [this.mapModality[this.state.modality]]: events })

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
        message: this.props.t('Calendar saved correctly!')
      })
    } catch ({ message }) {
      this.props.setNotification({
        open: true,
        type: 'error',
        message
      })
    }
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
    const { t } = this.props
    if (loading) return null

    return (
      <div className={this.props.classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Avatar alt={this.props.employee.name} src={this.props.employee.image || imageEmployee} />
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
                <FolderShared className={this.props.classes.icon} />
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
                      label={t('Pay')}
                    />
                    <Tab
                      className={this.props.classes.tab}
                      icon={this.state.calendarChanged['debt'] ? <Warning className={this.props.classes.warning} /> : <TrendingDown />}
                      label={t('Debt')}
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
                      <MonthLineChart data={this.state.events} currentDate={this.state.currentDate} calendarChanged={this.state.discardChanges} />
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
  }),
  graphql(createEvents, { name: 'createEvents' }),
  graphql(updateEvents, { name: 'updateEvents' }),
)(withStyles(styles)(translate('translations')(EmployeeCalendar))))
)