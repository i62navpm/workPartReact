import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Grid, IconButton, Typography } from 'material-ui'
import { FastRewind, FastForward } from 'material-ui-icons'

const styles = () => ({
  root: {
    marginBottom: 0
  },
  typography: {
    lineHeight: '44px'
  }
})

class Toolbar extends React.Component {
  constructor(props) {
    super(props)

    this.goToBack = this.goToBack.bind(this)
    this.goToNext = this.goToNext.bind(this)
  }

  async goToBack() {
    const mDate = this.props.date
    const monthBack = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1)
    await this.props.fetchEvents(monthBack)
    this.props.onNavigate('prev', monthBack)
  }

  async goToNext() {
    const mDate = this.props.date
    const monthNext = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1)
    await this.props.fetchEvents(monthNext)
    this.props.onNavigate('next', monthNext)
  }

  render() {
    return (
      <Grid container justify="space-between" className={this.props.classes.root}>
        <Grid item>
          <IconButton
            variant="raised"
            color="primary"
            disabled={this.props.calendarChanged[this.props.modality]}
            onClick={this.goToBack}
          >
            <FastRewind />
          </IconButton>
        </Grid>
        <Grid item>

          <Typography type="title" color="primary" className={this.props.classes.typography}>
            {this.props.label}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            variant="raised"
            color="primary"
            disabled={this.props.calendarChanged[this.props.modality]}
            onClick={this.goToNext}
          >
            <FastForward />
          </IconButton>
        </Grid>
      </Grid>

    )
  }
}

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Toolbar)