import React from 'react'
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types'

import bg1 from './images/bg1.png'

const styles = () => (
  {
    bgimg1: {
      display: 'block',
      width: '100%',
      fontSize: 0,
      overflow: 'hidden',
      backgroundColor: 'rgba(251,231,86,0.1)',
    },
  }
)

function BgComponent(props) {
  const { classes } = props
  return (
    <div className="bg-ctn">
      <img className={classes.bgimg1} src={bg1} alt="" />
    </div>
  )
}
BgComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(BgComponent)
