import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import Calendar from '../Calendar'
import { Typography, Avatar, IconButton, Grid, Paper } from 'material-ui'
import Tabs, { Tab } from 'material-ui/Tabs'
import { ExpandMore, Edit, TrendingUp, TrendingDown, Warning } from 'material-ui-icons'

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
  iconWarning: {
    marginLeft: 'auto'
  },
  icon: {
    width: 20,
    height: 20
  },
  tab: {
    maxWidth: 500
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

    const { classes, data } = props
    this.classes = classes

    this.mapModality = {
      0: 'pay',
      1: 'debt'
    }

    const { events, ...employeeInfo } = data
    this.state = {
      modality: 0,
      initialEvents: events,
      events,
      calendarChanged: { pay: false, debt: false },
      discardChanges: false,
      employeeInfo
    }
    this.changeModality = this.changeModality.bind(this)
    this.updateCalendar = this.updateCalendar.bind(this)
    this.onChangeCalendar = this.onChangeCalendar.bind(this)
    this.restoreEvents = this.restoreEvents.bind(this)
    this.saveEvents = this.saveEvents.bind(this)
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
  }

  showWarning() {
    return Object.values(this.state.calendarChanged).some(status => status === true)
      ? <IconButton>
          <Warning className={this.classes.warning} />
        </IconButton>
      : null
  }

  render() {
    return (
      <div className={this.classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Avatar alt={this.props.data.name} src={this.props.data.image} />
            <Typography className={this.classes.heading}>
              {this.props.data.name}
            </Typography>
            <div className={this.classes.iconWarning}>
              {this.showWarning()}
            </div>
            <Link
              to={`/worksheet/${this.props.companyId}/employee/${
                this.props.data.id
                }`}
            >
              <IconButton>
                <Edit className={this.classes.icon} />
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
                      className={this.classes.tab}
                      icon={this.state.calendarChanged['pay'] ? <Warning className={this.classes.warning} /> : <TrendingUp />}
                      label="Pay"
                    />
                    <Tab
                      className={this.classes.tab}
                      icon={this.state.calendarChanged['debt'] ? <Warning className={this.classes.warning} /> : <TrendingDown />}
                      label="Debt"
                    />
                  </Tabs>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Calendar
                  data={{
                    employeeInfo: this.state.employeeInfo,
                    events: this.state.events[this.mapModality[this.state.modality]],
                    modality: this.mapModality[this.state.modality],
                    discardChanges: this.state.discardChanges,
                    calendarChanged: this.state.calendarChanged
                  }}
                  updateCalendar={this.updateCalendar}
                  onChangeCalendar={this.onChangeCalendar}
                  restoreEvents={this.restoreEvents}
                  saveEvents={this.saveEvents}
                />
              </Grid>
              
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

EmployeeCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired
}

export default withStyles(styles)(EmployeeCalendar)
