import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ValidatorForm } from 'react-form-validator-core'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, CircularProgress, Grid, Paper, AppBar, Toolbar, Typography } from 'material-ui'
import green from 'material-ui/colors/green'
import { GroupAdd, Send } from 'material-ui-icons'
const debug = require('debug')
const error = debug('authRegister:error')

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

class Register extends React.Component {
  constructor(props) {
    super(props)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        username: '',
        password: ''
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
      try {
        await this.props.onSubmit(this.state.formData)
        this.props.history.push('/auth/verification')
        this.props.setNotification({
          open: true,
          type: 'success',
          message: 'Register Ok!, Verificate your email now!'
        })
      } catch ({message}) {
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
    const { formData, submitted } = this.state

    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={6}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <GroupAdd className={this.classes.iconLeft} />
                <Typography type="title" color="inherit">
                  Register
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
                  id="email"
                  name="username"
                  autoComplete="email"
                  label="Email"
                  onChange={this.handleChange}
                  value={formData.username}
                  validators={['required', 'isEmail']}
                  errorMessages={['Email is required', 'Email is not valid']}
                  fullWidth
                  required
                />
                <TextValidator
                  id="password"
                  name="password"
                  autoComplete="password"
                  label="Password"
                  type="password"
                  onChange={this.handleChange}
                  value={formData.password}
                  validators={['required', 'matchRegexp:^.{8,}$']}
                  errorMessages={['Password is required', 'The length must be more than 8 characters']}
                  margin="normal"
                  fullWidth
                  required
                />
                <Grid
                  className={this.classes.rowButtons}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Button component={Link} to="login" color="primary">
                      Have you an account?
                    </Button>
                  </Grid>
                  <Grid item className={this.classes.wrapper}>
                    <Button
                      type="submit"
                      raised
                      color="primary"
                      disabled={submitted}
                    >
                      Register
                      <Send className={this.classes.iconRight} />
                    </Button>
                    {submitted && <CircularProgress size={24} className={this.classes.buttonProgress} />}
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

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  setNotification: PropTypes.func
}

export default withStyles(styles)(Register)
