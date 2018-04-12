import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ValidatorForm } from 'react-form-validator-core'
import { setLoader } from '../../actions/loader'
import { TextValidator } from 'react-material-ui-form-validator'
import { withStyles } from 'material-ui/styles'
import { Button, CircularProgress, Grid, Paper, AppBar, Toolbar, Typography, IconButton } from 'material-ui'
import green from 'material-ui/colors/green'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { Face, Save, Close } from 'material-ui-icons'
import { translate } from 'react-i18next'
import UploadImage from '../UploadImage'
import { graphql } from 'react-apollo'
import getEmployee from '../../graphql/queries/getEmployee'
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
  uploadImage: {
    marginBottom: theme.spacing.unit * 2,
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

class EmployeeForm extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(!!props.match.params.employeeId)

    const { classes } = props
    this.classes = classes

    this.state = {
      formData: {
        name: '',
        nif: '',
        image: '',
        address: '',
        date: new Date().toISOString(),
        phone: '',
        email: '',
        description: '',
        fullSalary: 0,
        halfSalary: 0
      },
      loading: !!props.match.params.employeeId,
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
        await this.props.onSubmit(this.removeNull(this.state.formData))
        this.props.closeForm()
        this.props.setNotification({
          open: true,
          type: 'success',
          message: this.props.t('Employee created/edited succesfully!')
        })
      } catch ({ message }) {
        error(message)
        this.props.setNotification({
          open: true,
          type: 'error',
          message
        })
      } finally {
        this.setState({ submitted: false })
      }
    })
  }

  omitTypename(key, value) {
    return (key === '__typename' || !value)
      ? undefined
      : value
  }

  removeNull(obj) {
    return JSON.parse(JSON.stringify(obj), this.omitTypename)
  }

  componentWillReceiveProps(nextProps) {
    let { data: { getEmployee, loading } } = nextProps
    getEmployee = this.removeNull({ ...getEmployee })
    this.setState({ loading, formData: { ...this.state.formData, ...getEmployee } })
    this.props.setLoader(loading)
  }

  render() {
    let { formData, submitted, loading } = this.state
    const { t } = this.props

    if (loading) return null

    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Face className={this.classes.iconLeft} />
              <Typography type="title" color="inherit" className={this.classes.flex}>
                {t('Employee form')}
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
                <Grid className={this.classes.uploadImage} item xs={10} sm={6}>
                  <UploadImage image={formData.image} folder="employee" name="image" handleChange={this.handleChange} />
                </ Grid>
              </ Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="name"
                    name="name"
                    autoComplete="name"
                    label={t('Name')}
                    onChange={this.handleChange}
                    value={formData.name}
                    validators={['required']}
                    errorMessages={[t('Name is required')]}
                    fullWidth
                    required
                  />
                </ Grid>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    id="nif"
                    name="nif"
                    autoComplete="nif"
                    label={t('Nif')}
                    type="text"
                    onChange={this.handleChange}
                    value={formData.nif}
                    validators={['required', 'matchRegexp:^.{9,}$']}
                    errorMessages={[t('Nif is required'), t('The length must be 9 characters')]}
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
                    label={t('Email')}
                    validators={['isEmail']}
                    errorMessages={[t('Email is not valid')]}
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
                    label={t('Phone')}
                    type="phone"
                    onChange={this.handleChange}
                    value={formData.phone}
                    validators={['matchRegexp:^\\d{9}$']}
                    errorMessages={[t('The length must be 9 numbers')]}
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
                    label={t('Address')}
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
                    label={t('Description')}
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
                    <InputLabel htmlFor="fullSalary">{t('Full Salary')}</InputLabel>
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
                    <InputLabel htmlFor="halfSalary">{t('Half Salary')}</InputLabel>
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
                <Grid item className={this.classes.wrapper}>
                  <Button
                    type="submit"
                    raised
                    color="primary"
                    disabled={submitted}
                  >
                    {t('Save')}
                    <Save className={this.classes.iconRight} />
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

const mapStateToProps = state => {
  return {
    user: state.auth
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(graphql(getEmployee, {
  options: ({ match, businessId }) => ({
    variables: { id: match.params.employeeId, businessId: businessId },
    fetchPolicy: 'network-only'
  }),
  skip: ({ match }) => !match.params.employeeId
})(withStyles(styles)(translate('translations')(EmployeeForm))))
