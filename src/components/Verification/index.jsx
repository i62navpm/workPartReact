import React from 'react'
import PropTypes from 'prop-types'
import { ValidatorForm } from 'react-form-validator-core'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, Grid, Paper, AppBar, Toolbar, Typography } from 'material-ui'
import { VerifiedUser, Send } from 'material-ui-icons'

const styles = theme => ({
  paper: {
    padding: 16,
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  rowButtons: {
    marginTop: 30
  },
  iconRight: {
    marginLeft: theme.spacing.unit,
    width: 20,
    height: 20
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
    width: 32,
    height: 32,
  }
})

class Verification extends React.Component {
  constructor(props) {
    super(props)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        verificationCode: ''
      },
      submitted: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const { formData } = this.state
    formData[event.target.name] = event.target.value
    this.setState({ formData })
  }

  handleSubmit() {
    this.setState({ submitted: true }, async () => {
      await this.props.onSubmit(this.state.formData)
      this.setState({ submitted: false })
    })
  }

  render() {
    const { formData, submitted } = this.state

    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={8}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <VerifiedUser className={this.classes.iconLeft} />
                <Typography type="title" color="inherit">
                  Verificate email
                </Typography>
              </Toolbar>
            </AppBar>
            <Paper className={this.classes.paper}>
              <ValidatorForm
                className={this.classes.form}
                ref="form"
                onSubmit={this.handleSubmit}
                noValidate
              >
                <TextValidator
                  id="verificationCode"
                  name="verificationCode"
                  autoComplete="verificationCode"
                  label="Verification Code"
                  onChange={this.handleChange}
                  value={formData.verificationCode}
                  validators={['required']}
                  errorMessages={['Code is required']}
                  fullWidth
                  required
                />
                <Grid
                  className={this.classes.rowButtons}
                  container
                  justify="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      type="submit"
                      raised
                      color="primary"
                      disabled={submitted}
                    >
                      Verificate
                      <Send className={this.classes.iconRight} />
                    </Button>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Verification.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Verification)
