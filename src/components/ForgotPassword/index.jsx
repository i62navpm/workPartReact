import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ValidatorForm } from 'react-form-validator-core'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, Grid, Paper, AppBar, Stepper, Step, StepLabel, Toolbar, Typography } from 'material-ui'
import { MoodBad, Send } from 'material-ui-icons'
const debug = require('debug')
const error = debug('authForgotPassword:error')

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

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        email: '',
        code: '',
        password: ''
      },
      activeStep: 0,
      submitted: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  getSteps() {
    return ['Enter the email', 'Enter the new password']
  }

  getStepContent(step) {
    const { formData } = this.state

    switch (step) {
      case 0:
        return <TextValidator
          id="email"
          name="email"
          autoComplete="email"
          label="Email"
          onChange={this.handleChange}
          value={formData.email}
          validators={['required', 'isEmail']}
          errorMessages={['Email is required', 'Email is not valid']}
          fullWidth
          required
        />
      case 1:
        return (
          <React.Fragment>
            <TextValidator
              id="verificationCode"
              name="code"
              autoComplete="verificationCode"
              label="Verification Code"
              onChange={this.handleChange}
              value={formData.code}
              validators={['required']}
              errorMessages={['Code is required']}
              fullWidth
              required
            />
            <TextValidator
              id="password"
              name="password"
              autoComplete="new-password"
              label="New password"
              type="password"
              onChange={this.handleChange}
              value={formData.password}
              validators={['required', 'matchRegexp:^.{8,}$']}
              errorMessages={['Password is required', 'The length must be more than 8 characters']}
              margin="normal"
              fullWidth
              required
            />
          </React.Fragment>
        )
      default:
        return 'Unknown step'
    }
  }
  getStepButton(step) {
    const { submitted } = this.state

    switch (step) {
      case 0:
        return [
          <Button
            onClick={this.handleNext}
            color="primary"
            disabled={submitted}
          >
            Next Step
          </Button>,
          <Button component={Link} to="login" color="primary">
            Have you an account?
          </Button>
        ]
      case 1:
        return [
          <Button
            onClick={this.handleBack}
            color="primary"
            disabled={submitted}
          >
            Back Step
          </Button>,
          <Button
            type="submit"
            raised
            color="primary"
            disabled={submitted}
          >
            Verificate
          <Send className={this.classes.iconRight} />
          </Button>]
      default:
        return 'Unknown step'
    }
  }

  handleNext() {
    this.setState({ submitted: true }, async () => {
      try {
        await this.props.onNextStep(this.state.formData)
        this.setState({ activeStep: this.state.activeStep + 1 })
      } catch ({message}) {
        error(message)
      } finally {
        this.setState({ submitted: false })
      }
    })
  }

  handleBack() {
    const { activeStep } = this.state
    this.setState({
      activeStep: activeStep - 1,
    })
  }

  handleChange(event) {
    const { formData } = this.state
    formData[event.target.name] = event.target.value
    this.setState({ formData })
  }

  handleSubmit() {
    this.setState({ submitted: true }, async () => {
      try {
        await this.props.onSubmit(this.state.formData)
        this.setState({ submitted: false })
        this.props.history.push('/auth/login')
      } catch ({message}) {
        this.setState({ submitted: false })
        error(message)
      }
    })
  }

  render() {
    const { activeStep } = this.state

    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={8}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <MoodBad className={this.classes.iconLeft} />
                <Typography type="title" color="inherit">
                  Forgot the password
                </Typography>
              </Toolbar>
            </AppBar>
            <Paper className={this.classes.paper}>
              <Stepper activeStep={activeStep}>
                {this.getSteps().map((label) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
              <ValidatorForm
                className={this.classes.form}
                ref="form"
                onSubmit={this.handleSubmit}
                noValidate
              >
                {this.getStepContent(activeStep)}
                <Grid
                  className={this.classes.rowButtons}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  {this.getStepButton(activeStep).map((button, index) => {
                    return (
                      <Grid key={index} item>
                        {button}
                      </Grid>
                    )
                  })}
                </Grid>
              </ValidatorForm>

            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ForgotPassword)
