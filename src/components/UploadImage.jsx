import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardMedia } from 'material-ui/Card'
import { UploadField } from '@navjobs/upload'
import imageBusiness from '../assets/images/businessDefault.png'

const styles = () => ({
  media: {
    height: 150,
  }
})

class UploadImage extends React.Component {
  constructor(props) {
    super(props)

    const { image, name, handleChange, classes } = props
    this.classes = classes

    this.state = {
      image: image || imageBusiness,
      name,
      handleChange
    }

    this.onUpload = this.onUpload.bind(this)
  }

  onUpload() {
    const { handleChange, name } = this.state
    handleChange({
      target: {
        name,
        value: 'Value image'
      }
    })
  }

  render() {
    const { image } = this.state
    return (
      <Card>
        <UploadField
          onFiles={this.onUpload}
          uploadProps={{ accept: '.png, .jpg, .jpeg' }}
        >
          <CardMedia
            className={this.classes.media}
            image={image}
            title="Business image"
          />
        </UploadField>
      </ Card>
    )
  }
}

UploadImage.propTypes = {
  classes: PropTypes.object.isRequired,
  image: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default withStyles(styles)(UploadImage)