import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Hidden } from 'material-ui'
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
      <Hidden xsDown>
        <Typography className={props.classes.titleSummary} align="center" type="headline" color="primary">
          Employee Summary
      </Typography>
        <iframe title="Summary employee pdf" src={doc.output('datauristring')} type="application/pdf" width="100%" height="842px" />
      </Hidden>
    </React.Fragment>
  )
}

PdfSummary.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PdfSummary)