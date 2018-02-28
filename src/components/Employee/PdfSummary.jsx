import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'material-ui'
import { withStyles } from 'material-ui/styles'
import jsPDF from 'jspdf'

const styles = theme => ({
  titleSummary: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4 
  }
})

function PdfSummary(props) {
  let doc = new jsPDF()
  doc.setProperties({
    title: 'Employee summary'
  })

  doc.text('Hello world!', 10, 10)

  return (
    <React.Fragment>
      <Typography className={props.classes.titleSummary} align="center" type="headline" color="primary">
        Employee Summary
      </Typography>
      <iframe src={doc.output('datauristring')} type="application/pdf" width="100%" height="842px">
        
      </iframe>
    
    </React.Fragment>
  )
}

PdfSummary.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PdfSummary)