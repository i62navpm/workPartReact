import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Grid } from 'material-ui'
import { translate } from 'react-i18next'
import BusinessCard from './BusinessCard'
import AddButton from '../AddButton'
import { Typography } from 'material-ui'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  noBusiness: {
    marginTop: theme.spacing.unit * 4
  }
})

class Business extends React.Component {
  constructor(props) {
    super(props)

    const { classes, business } = props
    this.classes = classes
    this.business = business
  }

  getBusiness() {
    if (this.business && this.business.length) {
      return this.business.map(value => (
        <Grid key={value.id} xs={12} sm={6} md={4} item>
          <BusinessCard data={value} onRemove={this.props.onRemove}/>
        </Grid>
      ))
    } else {
      return (
        <div className={this.classes.noBusiness}>
          <Typography align="center" type="title" color="primary">
            {this.props.t('There is no bussiness yet.')}
          </Typography>
          <Typography align="center" type="subheading">
            {this.props.t('Please add new companies.')}
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
            {this.getBusiness()}
          </Grid>
        </Grid>
        <AddButton onClick={() => this.props.history.push('/business/company')} />
      </Grid>
    )
  }
}

Business.propTypes = {
  classes: PropTypes.object.isRequired,
  business: PropTypes.array.isRequired
}

export default withStyles(styles)(translate('translations')(Business))
