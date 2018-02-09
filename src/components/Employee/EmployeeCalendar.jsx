import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import { Typography, Avatar } from 'material-ui'
import { ExpandMore } from 'material-ui-icons'

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 2.5,
    marginLeft: theme.spacing.unit * 2,
    flexBasis: '33.33%',
    flexShrink: 0,
  },
})

class EmployeeCalendar extends React.Component {
  constructor(props) {
    super(props)
    
    const { classes, data } = props
    this.classes = classes
    this.data = data
  }

  render() {
    return (
      <div className={this.classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Avatar alt={this.data.name} src={this.data.image} />
            <Typography className={this.classes.heading}>{this.data.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
          </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

EmployeeCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(EmployeeCalendar)
