import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { Snackbar, IconButton } from 'material-ui'
import { Close, Error, Done } from 'material-ui-icons'
import { setNotification } from '../actions/notification'

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  },
  error: {
    fill: '#f44336'
  },
  success: {
    fill: '#4caf50'
  }
})

class Notification extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClick() {
    this.setState({ open: true })
  }

  handleClose() {
    this.props.setNotification({ ...this.props.notification, open: false })
  }

  getIcon(type) {
    const icons = {
      success: <Done className={this.props.classes['success']} />,
      error: <Error className={this.props.classes['error']} />
    }

    return icons[type]
  }
  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.props.notification.open}
          autoHideDuration={40000}
          onClose={this.handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={
            <span id="message-id">{this.props.notification.message}</span>}
          action={[
            <IconButton
              key="type"
            >
              {this.getIcon(this.props.notification.type)}
            </IconButton>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <Close />
            </IconButton>
          ]}
        />
      </React.Fragment>
    )
  }
}

Notification.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    notification: state.notification
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification = {}) => dispatch(setNotification(notification)),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Notification))
