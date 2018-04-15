import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Grid, Typography } from 'material-ui'
import { translate } from 'react-i18next'
import EmployeeCard from './EmployeeCard'
import AddButton from '../AddButton'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  noEmployees: {
    marginTop: theme.spacing.unit * 4
  }
})

class Employee extends React.Component {
  constructor(props) {
    super(props)

    const { classes, workforce } = props
    this.classes = classes
    this.workforce = workforce
  }

  getEmployees() {
    if (this.workforce && this.workforce.length) {
      return this.workforce.map(value => (
        <Grid key={value.id} xs={12} sm={6} md={4} item>
          <EmployeeCard data={value} onRemove={this.props.onRemove} history={this.props.history} />
        </Grid>
      ))
    } else {
      return (
        <div className={this.classes.noEmployees}>
          <Typography align="center" type="title" color="primary">
            {this.props.t('There is no employees yet.')}
          </Typography>
          <Typography align="center" type="subheading">
            {this.props.t('Please add new employees.')}
          </Typography>
        </div>
      )
    }
  }

  render() {
    return (
      <Grid container className={this.classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={24}>
            {this.getEmployees()}
          </Grid>
        </Grid>
        <AddButton onClick={() => this.props.history.push(`${this.props.match.url}/employee`)} />
      </Grid>
    )
  }
}

Employee.propTypes = {
  classes: PropTypes.object.isRequired,
  workforce: PropTypes.array.isRequired
}

export default withStyles(styles)(translate('translations')(Employee))
