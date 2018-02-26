import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLoader } from '../../actions/loader'
import { withStyles } from 'material-ui/styles'
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
import { TagFaces, Close, Home, Phone, Mail, FormatQuote } from 'material-ui-icons'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import SummaryBarChart from './SummaryBarChart'

const randomColor = function (obj) {
  const keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]]
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
    marginBottom: theme. spacing.unit * 2,
  },
  monthLineChart: {
    height: '250px',
    flex: 1
  },
})

class EmployeeSummary extends React.Component {
  constructor(props) {
    super(props)
    this.props.setLoader(true)

    const { classes } = props
    this.classes = classes

    const { loading, employeeSummary, ...data } = props.data
    this.state = {
      loading,
      employeeSummary,
      data
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data: { employeeSummary, loading } } = nextProps

    this.setState({ loading, employeeSummary })
    this.props.setLoader(loading)
  }

  render() {
    const { loading } = this.state

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
                Employee Summary
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
                    <Avatar aria-label="employee-summary" style={{ backgroundColor: randomColor(colors)[500] }}>
                      {this.state.employeeSummary.name[0]}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography color="primary" type="headline">{this.state.employeeSummary.name}</Typography>
                    <Typography type="subheading">{this.state.employeeSummary.nif}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              {this.state.employeeSummary.description && <Grid item xs={12}>
                <Grid
                  container
                  alignItems={'center'}
                  direction={'row'}
                  justify={'center'}
                >
                  <Grid item xs={10} sm={8} >
                    <Typography type="caption" className={this.classes.description} align="center"><FormatQuote />{this.state.employeeSummary.description}</Typography>
                    <Divider light/>
                  </Grid>
                </Grid>
              </Grid>}

              <Grid item xs={12} sm={4} md={3}>
                <Grid container>
                  <Grid item>
                    <Home className={this.classes.icons}/>
                  </Grid>
                  <Grid item>
                    <Typography type="body1">{this.state.employeeSummary.address}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Phone className={this.classes.icons}/>
                  </Grid>
                  <Grid item>
                    <Typography type="body1">{this.state.employeeSummary.phone}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Mail className={this.classes.icons}/>
                  </Grid>
                  <Grid item>
                    <Typography type="body1">
                      <a href={`mailto:${this.state.employeeSummary.nif}`}>{this.state.employeeSummary.email}</a>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>


              <Grid item xs={12} sm={8} md={9}>
                <Grid container alignItems={'center'} direction={'row'} justify={'center'}>
                  <Grid item className={this.classes.monthLineChart}>
                    <SummaryBarChart data={this.state.employeeSummary.events} />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoader: loading => dispatch(setLoader({ loading }))
  }
}

EmployeeSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  companyId: PropTypes.string.isRequired
}

export default graphql(gql`
  fragment EventSummary on Event {
    data {
      money
    },
    start
  }
  query getEmployeeSummary($companyId: ID, $employeeId: ID, $date: String) {
    employeeSummary(companyId: $companyId, employeeId: $employeeId, date: $date) {
      id,
      name,
      description,
      nif,
      address,
      email,
      phone,
      events {
        pay {
          ...EventSummary
        },
        debt {
          ...EventSummary
        }
      }
    }
  }
  `, {
    options: ({ match, companyId }) => {
      return { variables: { companyId, employeeId: match.params.employeeId, date: new Date().toISOString() } }
    }
  })(
    connect(
      null,
      mapDispatchToProps
    )(withStyles(styles)(EmployeeSummary))
  )
