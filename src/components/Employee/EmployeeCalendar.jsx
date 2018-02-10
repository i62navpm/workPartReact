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
import './calendar.css'

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

function Event({ event }) {
  return (
    <React.Fragment>
      <span className={'event-title'}>
        {event.data.title}
      </span>
      <span className={'event-money'}>
        {event.data.money}€
      </span>
    </React.Fragment>
  )
}

function EventWrapper({ event, children }) {
  return (
    <div className={`${event.data.salary} calendar-event`}>
      {children}
    </div>
  )
}

class EmployeeCalendar extends React.Component {
  constructor(props) {
    super(props)

    const { classes, data } = props
    this.classes = classes
    this.state = { events: [], ...data }

    this.onSelectEvent = this.onSelectEvent.bind(this)
    this.onSelectSlot = this.onSelectSlot.bind(this)
  }

  onSelectEvent(event) {
    console.log(event)
  }

  onSelectSlot(event) {
    event.slots.forEach(slot => {
      if(this.state.events.findIndex(slotEvent => slotEvent.start === slot.toString()) !== -1) return
      
      let newSlot = {
        start: slot.toString(),
        end: slot.toString(),
        allDay: true,
        data: {
          money: this.state.fullSalary,
          salary: 'fullSalary',
          title: 'Full Salary'
        }
      }
      this.setState({ events: [...this.state.events, newSlot] })
    })
  }

  render() {
    return (
      <div className={this.classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Avatar alt={this.state.name} src={this.state.image} />
            <Typography className={this.classes.heading}>{this.state.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <BigCalendar
              selectable
              style={{ height: 500 }}
              className={this.classes.calendar}
              events={this.state.events}
              defaultDate={new Date()}
              views={['month']}
              components={{
                event: Event,
                eventWrapper: EventWrapper
              }}
              onSelectEvent={this.onSelectEvent}
              onSelectSlot={this.onSelectSlot}
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
