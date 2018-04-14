import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardHeader, CardMedia, CardActions } from 'material-ui/Card'
import { Avatar, Button, IconButton } from 'material-ui'
import { colors } from 'material-ui'
import { Edit, Delete, People } from 'material-ui-icons'
import { translate } from 'react-i18next'
import { DateTime } from 'luxon'
import imageBusiness from '../../assets/images/businessDefault.png'
import BusinessRemoveModal from './BusinessRemoveModal'

const randomColor = function (obj) {
  const keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]]
}

const styles = theme => ({
  media: {
    height: 194,
  },
  flexGrow: {
    flex: '1 1 auto'
  },
  iconRight: {
    marginLeft: theme.spacing.unit,
    width: 20,
    height: 20
  },
})

class BusinessCard extends React.Component {
  constructor(props) {
    super(props)

    const { classes, data } = props
    this.classes = classes
    this.data = data

    this.openRemoveModal = this.openRemoveModal.bind(this)
  }

  openRemoveModal() {
    this.refs.removeModal.getWrappedInstance().handleClickOpen()
  }

  render() {
    return (
      <div className={'card-hover'}>
        <BusinessRemoveModal ref="removeModal" data={this.data} onRemove={this.props.onRemove} />
        <Card className={this.classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Business" style={{ backgroundColor: randomColor(colors)[500] }}>
                {this.data.name[0]}
              </Avatar>
            }
            title={this.data.name}
            subheader={this.data.date && DateTime.fromISO(this.data.date).toLocaleString(DateTime.DATE_HUGE)}
          />
          <Link to={`/worksheet/${this.data.id}`}>
            <CardMedia
              className={this.classes.media}
              image={this.data.image || imageBusiness}
              title={this.data.name}
            />
          </Link>
          <CardActions disableActionSpacing>
            <Button component={Link} to={`/business/company/${this.data.id}/workforce`} className={this.classes.button} raised color="primary">
              {this.props.t('Workforce')}
              <People className={this.classes.iconRight}/>
            </Button>

            <div className={this.classes.flexGrow} />
            <Link to={`/business/company/${this.data.id}`}>
              <IconButton className="edit-business" color="primary">
                <Edit />
              </IconButton>
            </Link>
            <IconButton className="delete-business" color="accent" onClick={this.openRemoveModal}>
              <Delete />
            </IconButton>
          </ CardActions>
        </Card>
      </div>
    )
  }
}

BusinessCard.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onRemove: PropTypes.func
}

export default withStyles(styles)(translate('translations')(BusinessCard))
