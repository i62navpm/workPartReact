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
import { ExpandMore, Edit, TrendingUp, TrendingDown } from 'material-ui-icons'

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
  iconLink: {
    marginLeft: 'auto'
  },
  icon: {
    width: 20,
    height: 20
  },
  tab: {
    maxWidth: 500
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
      events,
      employeeInfo
    }
    this.changeModality = this.changeModality.bind(this)
    this.updateCalendar = this.updateCalendar.bind(this)
  }

  changeModality(event, value) {
    this.setState({ modality: value })
  }

  updateCalendar(calendarUpdated) {
    this.setState({ events: { ...this.state.events, ...calendarUpdated } })
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
            <Link
              className={this.classes.iconLink}
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
                      icon={<TrendingUp />}
                      label="Pay"
                    />
                    <Tab
                      className={this.classes.tab}
                      icon={<TrendingDown />}
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
                    modality: this.mapModality[this.state.modality]
                  }
                  }
                  updateCalendar={this.updateCalendar}
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
