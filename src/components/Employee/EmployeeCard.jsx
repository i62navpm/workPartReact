import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardHeader, CardMedia, CardActions } from 'material-ui/Card'
import { Avatar, IconButton } from 'material-ui'
import { colors } from 'material-ui'
import { Edit, Delete } from 'material-ui-icons'
import { DateTime } from 'luxon'
import imageEmployee from '../../assets/images/employeeDefault.jpg'
import EmployeeRemoveModal from './EmployeeRemoveModal'

const randomColor = function (obj) {
  const keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]]
}

const styles = () => ({
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
    this.openRemoveModal = this.openRemoveModal.bind(this)
  }

  openRemoveModal() {
    this.refs.removeModal.handleClickOpen()
  }

  render() {
    return (
      <div className={'card-hover'}>
        <EmployeeRemoveModal ref="removeModal" data={this.data} onRemove={this.props.onRemove} />
        <Card className={this.classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Employee" style={{ backgroundColor: randomColor(colors)[500] }}>
                {this.data.name[0]}
              </Avatar>
            }
            title={this.data.name}
            subheader={this.data.date && DateTime.fromISO(this.data.date).toLocaleString(DateTime.DATE_HUGE)}
          />
          <Link to="/">
            <CardMedia
              className={this.classes.media}
              image={this.data.image || imageEmployee}
              title={this.data.name}
            />
          </Link>
          <CardActions disableActionSpacing>
            <div className={this.classes.flexGrow} />
            <Link to={`${this.props.history.location.pathname}/employee/${this.data.id}`}>
              <IconButton className="edit-workforce" color="primary">
                <Edit />
              </IconButton>
            </Link>
            <IconButton color="accent" onClick={this.openRemoveModal}>
              <Delete />
            </IconButton>
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
