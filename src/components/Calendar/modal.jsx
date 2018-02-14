import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Typography, Modal } from 'material-ui'

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
})

function SimpleModal(props) {

  return (
    <Modal
      open={props.openModal}
      onClose={props.handleModalClose}
    >
      <div className={props.classes.paper}>
        <Typography variant="title" id="modal-title">
          Text in a modal
          </Typography>
        <Typography variant="subheading" id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
      </div>
    </Modal>
  )
}


SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
  openModal: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
}

export default withStyles(styles)(SimpleModal)

