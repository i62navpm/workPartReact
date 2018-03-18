import React from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog'
import { Button } from 'material-ui'

class BusinessRemoveModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClickClose = this.handleClickClose.bind(this)
    this.handleClickRemove = this.handleClickRemove.bind(this)
  }

  handleClickOpen() {
    this.setState({ open: true })
  }

  handleClickClose() {
    this.setState({ open: false })
  }
  
  async handleClickRemove() {
    await this.props.onRemove({id: this.props.data.id})
    this.handleClickClose()
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Do you want to remove the business?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you remove the business <strong>{this.props.data.name}</strong> all your information will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClickClose} color="primary">
            Close
          </Button>
          <Button onClick={this.handleClickRemove} color="accent" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

BusinessRemoveModal.propTypes = {
  data: PropTypes.object.isRequired
}

export default BusinessRemoveModal
