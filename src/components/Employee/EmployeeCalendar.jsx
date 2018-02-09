import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import { Typography, Avatar } from 'material-ui'
import { ExpandMore } from 'material-ui-icons'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 2.5,
    marginLeft: theme.spacing.unit * 2,
  },
  calendar: {
    width: '100%'
  }
})

class EmployeeCalendar extends React.Component {
  constructor(props) {
    super(props)

    const { classes, data } = props
    this.classes = classes
    this.data = { events: [], ...data }
  }

  render() {
    return (
      <div className={this.classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Avatar alt={this.data.name} src={this.data.image} />
            <Typography className={this.classes.heading}>{this.data.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <BigCalendar
              style={{ height: 500 }}
              className={this.classes.calendar}
              events={this.data.events}
              views={['month']}
              showMultiDayTimes
              defaultDate={new Date()}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

EmployeeCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(EmployeeCalendar)
