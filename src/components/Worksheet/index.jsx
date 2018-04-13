import React from 'react'
import { Grid, Typography } from 'material-ui'
import { withStyles } from 'material-ui/styles'
import { BusinessCardSummary } from '../Business'
import { EmployeeCalendar } from '../Employee'
import SearchInput from '../SearchInput'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import i18n from '../../i18n'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/es'
import 'moment/locale/en-gb'

moment.locale(i18n.language)
BigCalendar.momentLocalizer(moment)

const styles = theme => ({
  noEmployees: {
    marginTop: theme.spacing.unit * 4
  }
})

class WorksheetPresentational extends React.Component {
  constructor(props) {
    super(props)

    const { employees: { items }, ...company } = props.company
    this.state = {
      initWorkforce: items,
      workforce: items,
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

  getEmployees() {
    const { workforce, company } = this.state

    if (workforce && workforce.length) {
      return workforce.map(employee => (
        <EmployeeCalendar
          key={employee.id}
          employee={employee}
          companyId={company.id}
        />
      ))
    } else {
      return (
        <div className={this.props.classes.noEmployees}>
          <Typography align="center" type="title" color="primary">
            There is no employees yet.
          </Typography>
          <Typography align="center" type="subheading">
            Please add new employees.
          </Typography>
        </div>
      )
    }
  }

  render() {
    const { company } = this.state

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
            {this.getEmployees()}
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(WorksheetPresentational)
