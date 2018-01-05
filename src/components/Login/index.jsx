import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ValidatorForm } from 'react-form-validator-core'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, Grid, Paper, AppBar, Toolbar, Typography } from 'material-ui'
import { AccountCircle, Send } from 'material-ui-icons'

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
    marginLeft: theme.spacing.unit
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
    width: 32,
    height: 32,
  }
})

class Login extends React.Component {
  constructor (props) {
    super(props)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        email: '',
        password: ''
      },
      submitted: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    const { formData } = this.state
    formData[event.target.name] = event.target.value
    this.setState({ formData })
  }

  handleSubmit () {
    this.setState({ submitted: true }, () => {
      setTimeout(() => this.setState({ submitted: false }), 5000)
    })
  }

  render () {
    const { formData, submitted } = this.state

    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={6}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <AccountCircle className={this.classes.iconLeft}/>
                <Typography type="title" color="inherit">
                  Login
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
                <TextValidator
                  id="password"
                  name="password"
                  autoComplete="password"
                  label="Password"
                  onChange={this.handleChange}
                  value={formData.password}
                  validators={['required']}
                  errorMessages={['Password is required']}
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
                    <Button component={Link} to="register" color="primary">
                      Register
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      raised
                      color="primary"
                      disabled={submitted}
                    >
                      Login
                      <Send className={this.classes.iconRight}/>
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

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login)