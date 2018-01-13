import React from 'react'
import { DateTime } from 'luxon'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardHeader, CardMedia } from 'material-ui/Card'
import { Avatar, IconButton } from 'material-ui'
import { red } from 'material-ui/colors'
import { Edit } from 'material-ui-icons'
import imageBusiness from '../../assets/images/businessDefault.png'

const styles = () => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 194,
  },
  avatar: {
    backgroundColor: red[500],
  }
})

class Business extends React.Component {
  constructor(props) {
    super(props)
    
    const { classes } = props
    this.classes = classes

    this.data = {
      name: 'Example business Manuel',
      date: DateTime.local().toLocaleString(DateTime.DATETIME_MED),
      image: imageBusiness
    }
  }

  render() {
    return (
      <div>
        <Card className={this.classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Business" className={this.classes.avatar}>
                {this.data.name[0]}
              </Avatar>
            }
            action={
              <IconButton>
                <Edit />
              </IconButton>
            }
            title={this.data.name}
            subheader={this.data.date}
          />
          <CardMedia
            className={this.classes.media}
            image={this.data.image}
            title={this.data.name}
          />
        </Card>
      </div>
    )
  }
}

Business.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Business)
