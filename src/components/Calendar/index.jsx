import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { IconButton } from 'material-ui'
import { Face } from 'material-ui-icons'
import BigCalendar from 'react-big-calendar'
import './calendar.css'

const styles = () => ({
  calendar: {
    width: '100%'
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

function Event({ event, classes, onSetEvent }) {
  return (
    <React.Fragment>
      <span className={'event-title'}>
        {event.data.title}
      </span>
      <span className={'event-money'}>
        {!event.data.money
          ? <IconButton variant="raised" color="primary" className={classes.smallIconButton} onClick={(e) => onSetEvent(e, event)}>
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

class Calendar extends React.Component {
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
    this.onSetEvent = this.onSetEvent.bind(this)
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

  onSetEvent(e, eventCalendar) {
    e.stopPropagation()

    const events = this.state.events.map(event => {
      if (event.end === eventCalendar.end) {
        const newData = {
          ...event.data,
          money: 50
        }

        return { ...event, data: newData }
      }
      return event
    })
    this.setState({ events })
  }

  render() {
    return (
      <BigCalendar
        selectable
        style={{ height: 500 }}
        className={this.classes.calendar}
        events={this.state.events}
        defaultDate={new Date()}
        views={['month']}
        components={{
          event: withStyles(styles)(({ ...rest }) => <Event onSetEvent={this.onSetEvent} {...rest} />),
          eventWrapper: EventWrapper
        }}
        onSelectEvent={this.onSelectEvent}
        onSelectSlot={this.onSelectSlot}
      />

    )
  }
}

Calendar.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(Calendar)
