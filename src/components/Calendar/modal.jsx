import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import {
  Typography,
  Modal,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Button
} from 'material-ui'

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: theme.spacing.unit * 30,
    maxWidth: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  },
  button: {
    marginTop: 5,
    float: 'right'
  }
})

class SimpleModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      money: 25
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleChange(event) {
    this.setState({ money: event.target.value })
  }

  handleClose() {
    this.props.handleModalClose(this.state.money)
  }

  render() {
    return (
      <Modal open={this.props.openModal} onClose={this.handleClose}>
        <div className={this.props.classes.paper}>
          <Typography type="title" id="modal-title">
            Insert a custom salary
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="fullSalary">Custom Salary</InputLabel>
            <Input
              id="fullSalary"
              type="number"
              name="fullSalary"
              onChange={this.handleChange}
              value={this.state.money}
              endAdornment={<InputAdornment position="end">€</InputAdornment>}
            />
          </FormControl>
          <Button className={this.props.classes.button} raised color="primary" onClick={this.handleClose}>
            Save
          </Button>
        </div>
      </Modal>
    )
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
  openModal: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
}

export default withStyles(styles)(SimpleModal)
