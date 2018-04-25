import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { ValidatorForm } from 'react-form-validator-core'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, CircularProgress, Grid, Paper, AppBar, Toolbar, Typography } from 'material-ui'
import green from 'material-ui/colors/green'
import { VerifiedUser, Send } from 'material-ui-icons'
import createUser from '../../graphql/mutations/createUser'
import { translate } from 'react-i18next'
const debug = require('debug')
const error = debug('verification:error')

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

class Verification extends React.Component {
  constructor(props) {
    super(props)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        code: ''
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
        const { email } = this.props.user
        await this.props.onSubmit(this.state.formData)
        await this.props.mutate({ variables: { input: { id: email, email } } })
        this.props.history.push('/auth/login')
        this.props.setNotification({
          open: true,
          type: 'success',
          message: this.props.t('Your email is verificated!, Login now!')
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
    const { formData, submitted } = this.state
    const { t } = this.props
    return (
      <Grid container justify="center" alignItems="center" className={this.classes.root}>
        <Grid item xs={12} sm={6}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <VerifiedUser className={this.classes.iconLeft} />
              <Typography type="title" color="inherit">
                {t('Verificate email')}
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
              <Grid
                className={this.classes.rowButtons}
                container
                justify="flex-end"
                alignItems="center"
              >
                <Grid item className={this.classes.wrapper}>
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
                </Grid>
              </Grid>
            </ValidatorForm>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

Verification.propTypes = {
  classes: PropTypes.object.isRequired,
  setNotification: PropTypes.func
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

export default graphql(createUser)(
  connect(
    mapStateToProps,
    null
  )(withStyles(styles)(translate('translations')(Verification)))
)
