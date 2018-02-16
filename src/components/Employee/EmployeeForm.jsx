import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ValidatorForm } from 'react-form-validator-core'
import { setLoader } from '../../actions/loader'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, Grid, Paper, AppBar, Toolbar, Typography, IconButton } from 'material-ui'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { Face, Save, Close } from 'material-ui-icons'
import UploadImage from '../UploadImage'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
const debug = require('debug')
const error = debug('employeeForm:error')

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

class EmployeeForm extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        name: '',
        nif: '',
        image: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        fullSalary: 0,
        halfSalary: 0
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
        this.props.closeForm()
      } catch (err) {
        this.setState({ submitted: false })
        error(err.message)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { data: { employee, loading } } = nextProps
    this.setState({ loading, formData: { ...this.state.formData, ...employee } })
    this.props.setLoader(loading)
  }

  render() {
    let { formData, submitted } = this.state
    const { loading } = this.props.data

    if (loading) return null

    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Face className={this.classes.iconLeft} />
              <Typography type="title" color="inherit" className={this.classes.flex}>
                Employee form
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
                  <UploadImage image={formData.image} folder="employee" name="image" handleChange={this.handleChange} />
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
                    id="nif"
                    name="nif"
                    autoComplete="nif"
                    label="Nif"
                    type="nif"
                    onChange={this.handleChange}
                    value={formData.nif}
                    validators={['required', 'matchRegexp:^.{9,}$']}
                    errorMessages={['Nif is required', 'The length must be 9 characters']}
                    fullWidth
                    required
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
                <Grid item xs={12}>
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
              </ Grid>
              <Grid container>
                <Grid item xs={12}>
                  <TextValidator
                    id="description"
                    name="description"
                    autoComplete="description"
                    label="Description"
                    onChange={this.handleChange}
                    value={formData.description}
                    multiline
                    rows="4"
                    fullWidth
                  />
                </ Grid>
              </ Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="fullSalary">Full Salary</InputLabel>
                    <Input
                      id="fullSalary"
                      type="number"
                      name="fullSalary"
                      onChange={this.handleChange}
                      value={formData.fullSalary}
                      endAdornment={<InputAdornment position="end">€</InputAdornment>}
                    />
                  </FormControl>
                </ Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="halfSalary">Half Salary</InputLabel>
                    <Input
                      id="halfSalary"
                      type="number"
                      name="halfSalary"
                      onChange={this.handleChange}
                      value={formData.halfSalary}
                      endAdornment={<InputAdornment position="end">€</InputAdornment>}
                    />
                  </FormControl>
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

const mapDispatchToProps = (dispatch) => {
  return {
    setLoader: (loading) => dispatch(setLoader({ loading }))
  }
}

EmployeeForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default graphql(gql`
  query getEmployee($employeeId: ID) {
    employee(id: $employeeId) {
      id,
      name,
      nif,
      address,
      phone,
      email,
      image,
      description,
      fullSalary,
      halfSalary
    }
  }
  `, {
    options: ({ match }) => {
      return { variables: { employeeId: match.params.employeeId } }
    }
  })(
    connect(
      null,
      mapDispatchToProps
    )(withStyles(styles)(EmployeeForm))
  )
