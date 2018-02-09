import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardMedia, CardContent } from 'material-ui/Card'
import { Typography, Grid } from 'material-ui'

const styles = () => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
})

class BusinessCardSummary extends React.Component {
  constructor(props) {
    super(props)

    const { classes, data } = props
    this.classes = classes
    this.data = data
  }

  render() {
    return (
      <Grid justify="center" direction="row" container>
        <Grid xs={12} sm={6} item>
          <Card className={this.classes.card}>
            <CardContent className={this.classes.content}>
              <Typography variant="headline">{this.data.name}</Typography>
              <Typography variant="subheading" color="secondary">
                {this.data.cif}
              </Typography>
            </CardContent>
            <CardMedia
              className={this.classes.cover}
              image={this.data.image}
              title="Company title"
            />
          </Card>
        </ Grid>
      </ Grid>
    )
  }
}

BusinessCardSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(BusinessCardSummary)
