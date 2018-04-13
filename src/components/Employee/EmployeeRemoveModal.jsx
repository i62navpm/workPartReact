import React from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog'
import { Button } from 'material-ui'
import { translate, Trans } from 'react-i18next'

class EmployeeRemoveModal extends React.Component {
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
    this.handleClickClose()
    await this.props.onRemove({ id: this.props.data.id })
  }

  render() {
    const { t } = this.props
    const name = this.props.data.name

    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('Do you want to remove this employee?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Trans i18nKey="removeEmployee">
              If you remove the employee <strong>{{name}}</strong> all your information will be lost.
            </Trans>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClickClose} color="primary">
            {t('Close')}
          </Button>
          <Button onClick={this.handleClickRemove} color="accent" autoFocus>
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

EmployeeRemoveModal.propTypes = {
  data: PropTypes.object.isRequired
}

export default translate('translations', { withRef: true })(EmployeeRemoveModal)
