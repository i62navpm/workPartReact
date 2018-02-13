import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import { Typography, Avatar, IconButton } from 'material-ui'
import { ExpandMore, Edit, Face } from 'material-ui-icons'
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
  },
  iconLink: {
    marginLeft: 'auto'
  },
  icon: {
    width: 20,
    height: 20
  },
  smallIcon: {
    color: 'white',
    width: 20,
    height: 20
  },
  smallIconButton: {
    width: 'auto',
    height: 'auto'
  }
})

function Event({ event, classes }) {
  const handleChange = e => {
    e.stopPropagation()
  }

  return (
    <React.Fragment>
      <span className={'event-title'}>
        {event.data.title}
      </span>
      <span className={'event-money'}>
        {!event.data.money
          ? <IconButton variant="raised" color="primary" className={classes.smallIconButton} onClick={handleChange}>
            <Face className={classes.smallIcon} />
          </IconButton>
          : `${event.data.money} €`}
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
    this.state = {
      events: [],
      status: [
        { salary: 'fullSalary', title: 'Full Salary' },
        { salary: 'halfSalary', title: 'Half Salary' },
        { salary: 'customSalary', title: 'Custom Salary' }
      ],
      ...data,
    }

    this.onSelectEvent = this.onSelectEvent.bind(this)
    this.onSelectSlot = this.onSelectSlot.bind(this)
  }

  onSelectEvent(event) {
    let index = this.state.status.findIndex(status => event.data.salary === status.salary)
    index = ++index % (this.state.status.length + 1)

    let events = this.state.events

    if (index === this.state.status.length) {
      events = events.filter(eventCalendar => eventCalendar.end !== event.end)
    } else {
      events = this.state.events.map(eventCalendar => {
        if (eventCalendar.end === event.end) {
          const newData = {
            ...eventCalendar.data,
            ...this.state.status[index],
            money: this.state[this.state.status[index].salary]
          }

          return { ...eventCalendar, data: newData }
        }
        return eventCalendar
      })
    }

    this.setState({ events })
  }

  onSelectSlot(event) {
    event.slots.forEach(slot => {
      if (this.state.events.findIndex(slotEvent => slotEvent.start === slot.toString()) !== -1) return

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
            <Link className={this.classes.iconLink} to={`/worksheet/${this.props.companyId}/employee/${this.state.id}`}>
              <IconButton>
                <Edit className={this.classes.icon} />
              </IconButton>
            </Link>
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
                event: withStyles(styles)(Event),
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
  data: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired
}

export default withStyles(styles)(EmployeeCalendar)
