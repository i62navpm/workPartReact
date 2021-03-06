import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Grid, Button, CircularProgress, TextField } from 'material-ui'
import green from 'material-ui/colors/green'
import { translate } from 'react-i18next'
import { DateTime } from 'luxon'
import Event from './Event'
import EventWrapper from './EventWrapper'
import BigCalendar from 'react-big-calendar'
import ModalCustomEvent from './ModalCustomEvent'
import ModalWork from './ModalWork'
import Toolbar from './Toolbar'
import Loading from '../Loading'
import './calendar.css'

const styles = () => ({
  calendarGrid: {
    position: 'relative'
  },
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
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
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
      openModalWork: false,
      currentDate: new Date(),
      updatingEvents: false,
      customEvent: {},
      submitted: false,
      ...data
    }

    this.onSelectEvent = this.onSelectEvent.bind(this)
    this.onSelectSlot = this.onSelectSlot.bind(this)
    this.onSetEvent = this.onSetEvent.bind(this)
    this.onSetWork = this.onSetWork.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleModalWorkOpen = this.handleModalWorkOpen.bind(this)
    this.handleModalWorkClose = this.handleModalWorkClose.bind(this)
    this.wrapFetchEvent = this.wrapFetchEvent.bind(this)
    this.getSearchDate = this.getSearchDate.bind(this)
    this.changeSearchDate = this.changeSearchDate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
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
        return { ...event, ...newData }
      }
      return event
    })

    this.setState({ events, openModal: false, customEvent: {} })
    this.props.onChangeCalendar(true)
  }

  handleModalWorkOpen() {
    this.setState({ openModalWork: true })
  }

  handleModalWorkClose(works = []) {
    if (works && works.length) {
      works = works.map(({ value }) => value)
    }
    const events = this.state.events.map(event => {
      if (event.end === this.state.customEvent.end) {
        const newData = {
          ...event.data,
          works
        }
        return { ...event, ...newData }
      }
      return event
    })

    this.setState({ events, openModal: false, customEvent: {} })
    this.setState({ openModalWork: false })
    this.props.onChangeCalendar(true)
  }

  onSelectEvent(event) {
    let index = this.state.status.findIndex(
      status => event.salary === status.salary
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

          return { ...eventCalendar, ...newData }
        }
        return eventCalendar
      })
    }

    this.setState({ events })
    this.props.onChangeCalendar(true)
  }

  onSelectSlot(event) {
    this.setState({ updatingEvents: true })
    const newEvents = event.slots.map(slot => {
      if (slot.getMonth() !== this.state.currentDate.getMonth()) return null
      if (
        this.state.events.findIndex(
          slotEvent => slotEvent.start === slot.toString()
        ) !== -1
      ) { return null }

      return {
        start: slot.toString(),
        end: slot.toString(),
        allDay: true,
        money: this.state.modality === 'pay' ? this.state.employeeInfo.fullSalary : null,
        ...this.state.status[0]

      }
    }).filter(event => event)
    this.setState({ events: [...this.state.events, ...newEvents] })
    this.setState({ updatingEvents: false })
    this.props.onChangeCalendar(true)
  }

  onSetEvent(e, eventCalendar) {
    e.stopPropagation()

    this.handleModalOpen()
    this.setState({ customEvent: eventCalendar })
  }

  onSetWork(e, eventCalendar) {
    e.stopPropagation()

    this.setState({ customEvent: eventCalendar })
    this.handleModalWorkOpen()
  }

  async onSubmit() {
    this.setState({ submitted: true })
    await this.props.saveEvents(this.state.events)
    this.setState({ submitted: false })

  }

  async wrapFetchEvent(date) {
    this.setState({ updatingEvents: true })
    await this.props.fetchEvents(date)
    this.setState({ currentDate: date, updatingEvents: false })
  }

  getSearchDate() {
    return DateTime.fromISO(new Date(this.state.currentDate).toISOString()).toISODate()
  }

  async changeSearchDate(e) {
    e.stopPropagation()
    await this.wrapFetchEvent(new Date(e.target.value))
  }

  render() {
    const { t } = this.props
    return (
      <Grid container>
        <Grid item xs={12} className={this.classes.calendarGrid}>
          {this.state.updatingEvents && <Loading />}
          <Grid item xs={12}>
            <TextField
              label={t('Search date')}
              type="date"
              onChange={this.changeSearchDate}
              defaultValue={this.getSearchDate()}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <BigCalendar
            selectable
            style={{ height: 520 }}
            className={this.classes.calendar}
            events={this.state.events}
            defaultDate={this.state.currentDate}
            date={this.state.currentDate}
            onNavigate={() => { }}
            views={['month']}
            components={{
              event: withStyles(styles)(({ ...rest }) => (
                <Event onSetEvent={this.onSetEvent} onSetWork={this.onSetWork} modality={this.state.modality} {...rest} />
              )),
              eventWrapper: EventWrapper,
              toolbar: ({ ...rest }) => <Toolbar modality={this.state.modality} fetchEvents={this.wrapFetchEvent} calendarChanged={this.state.calendarChanged} {...rest} />
            }}
            onSelectEvent={this.onSelectEvent}
            onSelectSlot={this.onSelectSlot}
          />
          <Grid>
            <Grid item xs={12}>
              <Grid container spacing={24} justify="flex-end">
                <Grid item>
                  <Button onClick={this.props.restoreEvents} raised color="accent" disabled={!this.state.calendarChanged[this.state.modality]}>
                    {t('Discard')}
                  </Button>
                </Grid>
                <Grid item className={this.classes.wrapper}>
                  <Button onClick={this.onSubmit} raised color="primary" disabled={!this.state.calendarChanged[this.state.modality] || this.state.submitted}>
                    {t('Save')}
                  </Button>
                  {this.state.submitted && <CircularProgress size={24} className={this.classes.buttonProgress} />}
                </Grid>
              </Grid>
            </Grid>
            <ModalCustomEvent
              openModal={this.state.openModal}
              handleModalClose={this.handleModalClose}
            />
            <ModalWork
              works={this.state.customEvent.works}
              openModal={this.state.openModalWork}
              handleModalClose={this.handleModalWorkClose}
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

export default withStyles(styles)(translate('translations')(Calendar))
