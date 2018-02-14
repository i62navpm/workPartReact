import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import Calendar from '../Calendar'
import { Typography, Avatar, IconButton } from 'material-ui'
import { ExpandMore, Edit } from 'material-ui-icons'

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 2.5,
    marginLeft: theme.spacing.unit * 2,
  },
  iconLink: {
    marginLeft: 'auto'
  },
  icon: {
    width: 20,
    height: 20
  }
})


class EmployeeCalendar extends React.Component {
  constructor(props) {
    super(props)

    const { classes, data } = props
    this.classes = classes
    this.state = {
      ...data
    }
  }

  render() {
    return (
      <div className={this.classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Avatar alt={this.state.name} src={this.state.image} />
            <Typography className={this.classes.heading}>{this.state.name}</Typography>
            <Link className={this.classes.iconLink} to={`/worksheet/${this.props.companyId}/employee/${this.state.id}`}>
              <IconButton>
                <Edit className={this.classes.icon} />
              </IconButton>
            </Link>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Calendar data={this.props.data} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

EmployeeCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired
}

export default withStyles(styles)(EmployeeCalendar)
