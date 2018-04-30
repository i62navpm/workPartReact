import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ValidatorForm } from 'react-form-validator-core'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, CircularProgress, Grid, Paper, AppBar, Stepper, Step, StepLabel, Toolbar, Typography } from 'material-ui'
import green from 'material-ui/colors/green'
import { MoodBad, Send } from 'material-ui-icons'
import { translate } from 'react-i18next'
const debug = require('debug')
const error = debug('authForgotPassword:error')

const styles = theme => ({
  root: {
    height: '100vh',
  },
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
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
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
    return [this.props.t('Enter the email'), this.props.t('Enter the new password')]
  }

  getStepContent(step) {
    const { formData } = this.state
    const { t } = this.props

    switch (step) {
      case 0:
        return <TextValidator
          id="email"
          name="email"
          autoComplete="email"
          label={t('Email')}
          onChange={this.handleChange}
          value={formData.email}
          validators={['required', 'isEmail']}
          errorMessages={[t('Email is required'), t('Email is not valid')]}
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
              label={t('Verification Code')}
              onChange={this.handleChange}
              value={formData.code}
              validators={['required']}
              errorMessages={[t('Code is required')]}
              fullWidth
              required
            />
            <TextValidator
              id="password"
              name="password"
              autoComplete="new-password"
              label={t('New password')}
              type="password"
              onChange={this.handleChange}
              value={formData.password}
              validators={['required', 'matchRegexp:^.{8,}$']}
              errorMessages={[t('Password is required'), t('The length must be more than 8 characters')]}
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
    const { t } = this.props

    switch (step) {
      case 0:
        return [
          <span className={this.classes.wrapper}>
            <Button
              onClick={this.handleNext}
              color="primary"
              disabled={submitted}
            >
              {t('Next Step')}
            </Button>
            {submitted && <CircularProgress size={24} className={this.classes.buttonProgress} />}
          </span>,
          <Button component={Link} to="login" color="primary">
            {t('Have you an account?')}
          </Button>
        ]
      case 1:
        return [
          <Button
            onClick={this.handleBack}
            color="primary"
            disabled={submitted}
          >
            {t('Back Step')}
          </Button>,
          <span className={this.classes.wrapper}>
            <Button
              type="submit"
              raised
              color="primary"
              disabled={submitted}
            >
              {t('Verificate')}
              <Send className={this.classes.iconRight} />
            </Button>
            {submitted && <CircularProgress size={24} className={this.classes.buttonProgress} />}
          </span >]
      default:
        return 'Unknown step'
    }
  }

  handleNext() {
    this.setState({ submitted: true }, async () => {
      try {
        await this.props.onNextStep(this.state.formData)
        this.setState({ activeStep: this.state.activeStep + 1 })
        this.props.setNotification({
          open: true,
          type: 'success',
          message: this.props.t('We send you an email with a verification code!')
        })
      } catch ({ message }) {
        this.props.setNotification({
          open: true,
          type: 'error',
          message
        })
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
        this.props.history.push('/auth/login')
        this.props.setNotification({
          open: true,
          type: 'success',
          message: this.props.t('Your password have been changed!')
        })
      } catch ({ message }) {
        this.props.setNotification({
          open: true,
          type: 'error',
          message
        })
        error(message)
      } finally {
        this.setState({ submitted: false })
      }
    })
  }

  render() {
    const { activeStep } = this.state
    const { t } = this.props
    return (
      <Grid container justify="center" alignItems="center" className={this.classes.root}>
        <Grid item xs={12} sm={8} md={5}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <MoodBad className={this.classes.iconLeft} />
              <Typography type="title" color="inherit">
                {t('Forgot the password?')}
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
    )
  }
}

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  setNotification: PropTypes.func
}

export default withStyles(styles)(translate('translations')(ForgotPassword))
