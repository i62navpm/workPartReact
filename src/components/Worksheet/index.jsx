import React from 'react'
import { Grid } from 'material-ui'
import { BusinessCardSummary } from '../Business'
import { EmployeeCalendar } from '../Employee'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

BigCalendar.momentLocalizer(moment)

function WorksheetPresentational({ data }) {
  const { loading, company } = data

  if (loading) return <div>Loading...</div>
  
  return (
    <React.Fragment>
      <Grid justify="center" direction="row" spacing={40} container>
        <Grid xs={12} sm={6} item>
          <BusinessCardSummary data={company} />
        </Grid>
        <Grid xs={12} sm={10} item>
          {company.workforce.map(employee => <EmployeeCalendar key={employee.id} data={employee} companyId={company.id}/>)}
        </ Grid>
      </Grid>
    </React.Fragment>
  )
}

export default WorksheetPresentational
