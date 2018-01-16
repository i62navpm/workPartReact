import React from 'react'
import PropTypes from 'prop-types'
import { ValidatorForm } from 'react-form-validator-core'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, Grid, Paper, AppBar, Toolbar, Typography, IconButton } from 'material-ui'
import { Domain, Save, Close } from 'material-ui-icons'
import UploadImage from '../UploadImage'

const styles = theme => ({
  paper: {
    padding: 16,
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  flex: {
    flex: 1
  },
  rowSubmit: {
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

class BusinessForm extends React.Component {
  constructor(props) {
    super(props)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        name: '',
        cif: '',
        image: '',
        address: '',
        phone: '',
        email: '',
        web: ''
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
        this.setState({ submitted: false })
        this.props.history.push('/')
      } catch (err) {
        this.setState({ submitted: false })
        console.log(err.message)
      }
    })
  }

  render() {
    const { formData, submitted } = this.state

    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Domain className={this.classes.iconLeft} />
              <Typography type="title" color="inherit" className={this.classes.flex}>
                Business form
                </Typography>
              <IconButton
                onClick={this.props.closeForm}
                color="contrast"
              >
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Paper className={this.classes.paper}>
            <ValidatorForm
              className={this.classes.form}
              ref="form"
              onSubmit={this.handleSubmit}
              noValidate
            >
              <Grid container
                justify="center"
              >
                <Grid item xs={10} sm={6}>
                  <UploadImage image={formData.image} name="image" handleChange={this.handleChange} />
                </ Grid>
              </ Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="name"
                    name="name"
                    autoComplete="name"
                    label="Name"
                    onChange={this.handleChange}
                    value={formData.name}
                    validators={['required']}
                    errorMessages={['Name is required']}
                    fullWidth
                    required
                  />
                </ Grid>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="cif"
                    name="cif"
                    autoComplete="cif"
                    label="Cif"
                    type="cif"
                    onChange={this.handleChange}
                    value={formData.cif}
                    validators={['required', 'matchRegexp:^.{9,}$']}
                    errorMessages={['Cif is required', 'The length must be 9 characters']}
                    fullWidth
                    required
                  />
                </ Grid>
              </ Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="address"
                    name="address"
                    autoComplete="address"
                    label="Address"
                    onChange={this.handleChange}
                    value={formData.address}
                    fullWidth
                  />
                </ Grid>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="phone"
                    name="phone"
                    autoComplete="phone"
                    label="Phone"
                    type="phone"
                    onChange={this.handleChange}
                    value={formData.phone}
                    validators={['matchRegexp:^\\d{9}$']}
                    errorMessages={['The length must be 9 numbers']}
                    fullWidth
                  />
                </ Grid>
              </ Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="email"
                    name="email"
                    autoComplete="email"
                    label="Email"
                    validators={['isEmail']}
                    errorMessages={['Email is not valid']}
                    onChange={this.handleChange}
                    value={formData.email}
                    fullWidth
                  />
                </ Grid>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="web"
                    name="web"
                    autoComplete="web"
                    label="Web"
                    type="web"
                    onChange={this.handleChange}
                    value={formData.web}
                    fullWidth
                  />
                </ Grid>
              </ Grid>
              <Grid
                className={this.classes.rowSubmit}
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
                    Save
                      <Save className={this.classes.iconRight} />
                  </Button>
                </Grid>
              </Grid>
            </ValidatorForm>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

BusinessForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BusinessForm)
