import React from 'react'
import { Grid } from 'material-ui'
import { BusinessCardSummary } from '../Business'
import { EmployeeCalendar } from '../Employee'
import SearchInput from '../SearchInput'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/en-gb'

BigCalendar.momentLocalizer(moment)

class WorksheetPresentational extends React.Component {
  constructor(props) {
    super(props)

    const { workforce, ...company } = props.company
    this.state = {
      initWorkforce: workforce,
      workforce,
      company
    }

    this.filterWorkforce = this.filterWorkforce.bind(this)
  }

  filterWorkforce(text) {
    const { initWorkforce } = this.state

    this.setState({
      workforce: initWorkforce.filter(employee =>
        employee.name
          .trim()
          .toLowerCase()
          .includes(text.trim().toLowerCase())
      )
    })
  }

  render() {
    const { workforce, company } = this.state
    return (
      <React.Fragment>
        <Grid justify="center" direction="row" spacing={40} container>
          <Grid xs={12} sm={6} item>
            <BusinessCardSummary data={company} />
          </Grid>
          <Grid xs={12} sm={11} item>
            <Grid justify="flex-end" container>
              <Grid xs={12} sm={6} item>
                <SearchInput filterFn={this.filterWorkforce} />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} sm={10} item>
            {workforce.map(employee => (
              <EmployeeCalendar
                key={employee.id}
                employee={employee}
                companyId={company.id}
              />
            ))}
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default WorksheetPresentational
