import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Button } from 'material-ui'
import { Add } from 'material-ui-icons'


const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  }
})

class BusinessAddButton extends React.Component {
  constructor(props) {
    super(props)
    
    const { classes, onClick } = props
    this.classes = classes
    this.onClick = onClick
  }

  render() {
    return (
      <Button fab onClick={this.onClick} className={this.classes.fab} color="primary">
        <Add />
      </Button>
    )
  }
}

BusinessAddButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default withStyles(styles)(BusinessAddButton)