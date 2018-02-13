import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardHeader, CardMedia, CardActions } from 'material-ui/Card'
import { Avatar, IconButton } from 'material-ui'
import { colors } from 'material-ui'
import { Edit, Delete } from 'material-ui-icons'

const randomColor = function (obj) {
  const keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]]
}

const styles = () => ({
  card: {
    width: 400,
  },
  media: {
    height: 194,
  },
  flexGrow: {
    flex: '1 1 auto'
  }
})

class Employee extends React.Component {
  constructor(props) {
    super(props)

    const { classes, data } = props
    this.classes = classes
    this.data = data
  }

  render() {
    return (
      <div className={'card-hover'}>
        <Card className={this.classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Employee" style={{backgroundColor: randomColor(colors)[500]}}>
                {this.data.name[0]}
              </Avatar>
            }
            title={this.data.name}
            subheader={this.data.date}
          />
          <Link to="/">
            <CardMedia
              className={this.classes.media}
              image={this.data.image}
              title={this.data.name}
            />
          </Link>
          <CardActions disableActionSpacing>
            <div className={this.classes.flexGrow} />
            <IconButton color="accent">
              <Delete />
            </IconButton>
            <Link to={`/workforce/employee/${this.data.id}`}>
              <IconButton color="primary">
                <Edit />
              </IconButton>
            </Link>
          </ CardActions>
        </Card>
      </div>
    )
  }
}

Employee.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(Employee)
