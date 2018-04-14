import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setNotification } from '../../actions/notification'
import { setLoader } from '../../actions/loader'
import { withStyles } from 'material-ui/styles'
import { translate } from 'react-i18next'
import {
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Divider,
  colors
} from 'material-ui'
import {
  TagFaces,
  Close,
  Home,
  Phone,
  Mail,
  FormatQuote
} from 'material-ui-icons'
import { graphql, compose } from 'react-apollo'
import SummaryBarChart from './SummaryBarChart'
import PdfSummary from './PdfSummary'
import getSummaryEmployee from '../../graphql/queries/getSummaryEmployee'

const randomColor = function (obj) {
  const keys = Object.keys(obj)
  return obj[keys[(keys.length * Math.random()) << 0]]
}

const styles = theme => ({
  paper: {
    padding: 16,
    textAlign: 'center'
  },
  root: {
    flexGrow: 1,
    textAlign: 'left'
  },
  rowSubmit: {
    marginTop: 30
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
    width: 32,
    height: 32
  },
  iconRight: {
    marginLeft: theme.spacing.unit,
    width: 20,
    height: 20
  },
  flex: {
    flex: 1
  },
  icons: {
    fill: '#9e9e9e'
  },
  description: {
    fontStyle: 'italic',
    marginBottom: theme.spacing.unit * 2
  },
  monthLineChart: {
    height: '250px',
    flex: 1
  }
})

class EmployeeSummary extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { classes } = props
    this.classes = classes

    const { loading, getEmployee, ...data } = props.data
    this.state = {
      loading,
      getEmployee,
      events: [],
      data
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data: { getEmployee, getEventsByEmployeeIdIndexByYear: { items }, loading } } = nextProps
    this.setState({ loading, getEmployee, events: items })
    this.props.setLoader(loading)
  }

  render() {
    const { loading } = this.state
    const { t } = this.props

    if (loading) return null

    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={10}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <TagFaces className={this.classes.iconLeft} />
              <Typography
                type="title"
                color="inherit"
                className={this.classes.flex}
              >
                {t('Employee Summary')}
              </Typography>
              <IconButton onClick={this.props.closeForm} color="contrast">
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Paper className={this.classes.paper}>
            <Grid container className={this.classes.root}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems={'center'}
                  direction={'row'}
                  justify={'flex-start'}
                >
                  <Grid item>
                    <Avatar
                      aria-label="employee-summary"
                      style={{ backgroundColor: randomColor(colors)[500] }}
                    >
                      {this.state.getEmployee.name[0]}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography color="primary" type="headline">
                      {this.state.getEmployee.name}
                    </Typography>
                    <Typography type="subheading">
                      {this.state.getEmployee.nif}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {this.state.getEmployee.description && (
                <Grid item xs={12}>
                  <Grid
                    container
                    alignItems={'center'}
                    direction={'row'}
                    justify={'center'}
                  >
                    <Grid item xs={10} sm={8}>
                      <Typography
                        type="caption"
                        className={this.classes.description}
                        align="center"
                      >
                        <FormatQuote />
                        {this.state.getEmployee.description}
                      </Typography>
                      <Divider light />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Grid item xs={12} sm={4} md={3}>
                {this.state.getEmployee.address && <Grid container>
                  <Grid item>
                    <Home className={this.classes.icons} />
                  </Grid>
                  <Grid item>
                    <Typography type="body1">
                      {this.state.getEmployee.address}
                    </Typography>
                  </Grid>
                </Grid>}
                {this.state.getEmployee.phone && <Grid container>
                  <Grid item>
                    <Phone className={this.classes.icons} />
                  </Grid>
                  <Grid item>
                    <Typography type="body1">
                      {this.state.getEmployee.phone}
                    </Typography>
                  </Grid>
                </Grid>}
                {this.state.getEmployee.email && <Grid container>
                  <Grid item>
                    <Mail className={this.classes.icons} />
                  </Grid>
                  <Grid item>
                    <Typography type="body1">
                      <a href={`mailto:${this.state.getEmployee.email}`}>
                        {this.state.getEmployee.email}
                      </a>
                    </Typography>
                  </Grid>
                </Grid>}
              </Grid>

              <Grid item xs={12} sm={8} md={9}>
                <Grid
                  container
                  alignItems={'center'}
                  direction={'row'}
                  justify={'center'}
                >
                  <Grid item className={this.classes.monthLineChart}>
                    <SummaryBarChart data={this.state.events} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <PdfSummary companyId={this.props.businessId} employee={this.state.getEmployee} />
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

EmployeeSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  businessId: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification = {}) => dispatch(setNotification(notification)),
    setLoader: (loading) => dispatch(setLoader({ loading }))
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(compose(
  graphql(getSummaryEmployee, {
    options: ({ match, businessId }) => ({
      variables: { id: match.params.employeeId, businessId, yearId: new Date().getFullYear() },
      fetchPolicy: 'network-only'
    }),
  }),
)(withStyles(styles)(translate('translations')(EmployeeSummary))))
)