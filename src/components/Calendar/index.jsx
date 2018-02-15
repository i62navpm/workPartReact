import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Event from './Event'
import EventWrapper from './EventWrapper'
import BigCalendar from 'react-big-calendar'
import Modal from './modal'
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

class Calendar extends React.Component {
  constructor (props) {
    super(props)

    const { classes, data } = props
    this.classes = classes

    this.statusOptions = {
      pay: [
        { salary: 'fullSalary', title: 'Full Salary' },
        { salary: 'halfSalary', title: 'Half Salary' },
        { salary: 'customSalary', title: 'Custom Salary' }
      ],
      debt: [
        { salary: 'debtSalary', title: 'Debt Salary' }
      ]
    }
    this.state = {
      events: [],
      status: this.statusOptions[data.modality],
      openModal: false,
      customEvent: {},
      modality: data.modality,
      ...data.calendarData
    }

    this.onSelectEvent = this.onSelectEvent.bind(this)
    this.onSelectSlot = this.onSelectSlot.bind(this)
    this.onSetEvent = this.onSetEvent.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.modality !== nextProps.data.modality) {
      this.setState({
        events: nextProps.data.calendarData.events,
        modality: nextProps.data.modality,
        status: this.statusOptions[nextProps.data.modality]
      })
    }
  }

  handleModalOpen () {
    this.setState({ openModal: true })
  }

  handleModalClose (money) {
    const events = this.state.events.map(event => {
      if (event.end === this.state.customEvent.end) {
        const newData = {
          ...event.data,
          money
        }

        return { ...event, data: newData }
      }
      return event
    })

    this.setState({ events, openModal: false, customEvent: {} })
  }

  onSelectEvent (event) {
    let index = this.state.status.findIndex(
      status => event.data.salary === status.salary
    )
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
            money: this.state[this.state.status[index].salary || 0]
          }

          return { ...eventCalendar, data: newData }
        }
        return eventCalendar
      })
    }

    this.setState({ events })
  }

  onSelectSlot (event) {
    event.slots.forEach(slot => {
      if (
        this.state.events.findIndex(
          slotEvent => slotEvent.start === slot.toString()
        ) !== -1
      ) { return }

      let newSlot = {
        start: slot.toString(),
        end: slot.toString(),
        allDay: true,
        data: {
          money: this.state.modality === 'pay' ? this.state.fullSalary : null,
          ...this.state.status[0]
        }
      }
      this.setState({ events: [...this.state.events, newSlot] })
    })
  }

  onSetEvent (e, eventCalendar) {
    e.stopPropagation()

    this.handleModalOpen()
    this.setState({ customEvent: eventCalendar })
  }

  render () {
    return (
      <React.Fragment>
        <BigCalendar
          selectable
          style={{ height: 500 }}
          className={this.classes.calendar}
          events={this.state.events}
          defaultDate={new Date()}
          views={['month']}
          components={{
            event: withStyles(styles)(({ ...rest }) => (
              <Event onSetEvent={this.onSetEvent} {...rest} />
            )),
            eventWrapper: EventWrapper
          }}
          onSelectEvent={this.onSelectEvent}
          onSelectSlot={this.onSelectSlot}
        />
        <Modal
          openModal={this.state.openModal}
          handleModalClose={this.handleModalClose}
        />
      </React.Fragment>
    )
  }
}

Calendar.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(Calendar)
