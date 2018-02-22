import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Grid, Button } from 'material-ui'
import Event from './Event'
import EventWrapper from './EventWrapper'
import BigCalendar from 'react-big-calendar'
import Modal from './modal'
import Toolbar from './Toolbar'
import './calendar.css'

const styles = () => ({
  calendar: {
    width: '100%',
    marginBottom: 20
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
  constructor(props) {
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
      ...data
    }

    this.onSelectEvent = this.onSelectEvent.bind(this)
    this.onSelectSlot = this.onSelectSlot.bind(this)
    this.onSetEvent = this.onSetEvent.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
  }

  hasChanged(stateCalendar, nextCalendar) {
    if (!nextCalendar) return
    return Object.values(stateCalendar).toString() !== Object.values(nextCalendar).toString()
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.modality !== nextProps.data.modality || this.state.discardChanges !== nextProps.data.discardChanges) {
      this.props.updateCalendar({ [this.state.modality]: this.state.events })
      this.setState({
        events: nextProps.data.events,
        modality: nextProps.data.modality,
        discardChanges: nextProps.data.discardChanges,
        status: this.statusOptions[nextProps.data.modality]
      })
    } else if (this.hasChanged(this.state.calendarChanged, nextProps.data.calendarChanged)) {
      this.setState({ calendarChanged: nextProps.data.calendarChanged })
    }
  }

  handleModalOpen() {
    this.setState({ openModal: true })
  }

  handleModalClose(money) {
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
    this.props.onChangeCalendar(true)
  }

  onSelectEvent(event) {
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
            money: this.state.employeeInfo[this.state.status[index].salary || 0]
          }

          return { ...eventCalendar, data: newData }
        }
        return eventCalendar
      })
    }

    this.setState({ events })
    this.props.onChangeCalendar(true)
  }

  onSelectSlot(event) {
    const newEvents = event.slots.map(slot => {
      if (
        this.state.events.findIndex(
          slotEvent => slotEvent.start === slot.toString()
        ) !== -1
      ) { return null }

      return {
        start: slot.toString(),
        end: slot.toString(),
        allDay: true,
        data: {
          money: this.state.modality === 'pay' ? this.state.employeeInfo.fullSalary : null,
          ...this.state.status[0]
        }
      }
    }).filter(event => event)
    this.setState({ events: [...this.state.events, ...newEvents] })
    this.props.onChangeCalendar(true)
  }

  onSetEvent(e, eventCalendar) {
    e.stopPropagation()

    this.handleModalOpen()
    this.setState({ customEvent: eventCalendar })
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={12}>
          <BigCalendar
            selectable
            style={{ height: 520 }}
            className={this.classes.calendar}
            events={this.state.events}
            defaultDate={new Date()}
            views={['month']}
            components={{
              event: withStyles(styles)(({ ...rest }) => (
                <Event onSetEvent={this.onSetEvent} {...rest} />
              )),
              eventWrapper: EventWrapper,
              toolbar: ({ ...rest }) => <Toolbar modality={this.state.modality} calendarChanged={this.state.calendarChanged} {...rest} />
            }}
            onSelectEvent={this.onSelectEvent}
            onSelectSlot={this.onSelectSlot}
          />
          <Grid>
            <Grid item xs={12}>
              <Grid container spacing={24} justify="flex-end">
                <Grid item>
                  <Button onClick={this.props.restoreEvents} raised color="accent" disabled={!this.state.calendarChanged[this.state.modality]}>
                    Discard
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => this.props.saveEvents(this.state.events)} raised color="primary" disabled={!this.state.calendarChanged[this.state.modality]}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Modal
              openModal={this.state.openModal}
              handleModalClose={this.handleModalClose}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

Calendar.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  updateCalendar: PropTypes.func,
  onChangeCalendar: PropTypes.func,
  restoreEvents: PropTypes.func,
  saveEvents: PropTypes.func
}

export default withStyles(styles)(Calendar)
