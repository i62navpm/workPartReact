import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Grid } from 'material-ui'
import BusinessCard from './BusinessCard'
import AddButton from '../AddButton'

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
              <Grid key={value.id} xs={12} sm={6} md={4} item>
                <BusinessCard data={value}/>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <AddButton onClick={() => this.props.history.push('/business/company')}/>
      </Grid>
    )
  }
}

Business.propTypes = {
  classes: PropTypes.object.isRequired,
  business: PropTypes.array.isRequired
}

export default withStyles(styles)(Business)
