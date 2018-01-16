import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Grid } from 'material-ui'
import BusinessCard from './BusinessCard'
import BusinessAddButton from './BusinessAddButton'

const styles = () => ({
  root: {
    flexGrow: 1
  }
})

class Business extends React.Component {
  constructor(props) {
    super(props)
    
    const { classes, business } = props
    this.classes = classes
    this.business = business
  }

  render() {
    return (
      <Grid container className={this.classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={24}>
            {this.business.map(value => (
              <Grid key={value.id} item>
                <BusinessCard data={value}/>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <BusinessAddButton onClick={() => this.props.history.push('/business/new')}/>
      </Grid>
    )
  }
}

Business.propTypes = {
  classes: PropTypes.object.isRequired,
  business: PropTypes.array.isRequired
}

export default withStyles(styles)(Business)
