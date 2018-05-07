import React from 'react'
import PropTypes from 'prop-types'

import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'

import btnMusic from './images/btn-music.png'
import btnVideo from './images/btn-video.png'
import btnRead from './images/btn-read.png'

export default class InterComponent extends React.Component {
  componentDidMount() {
    // do something here
  }
  render() {
    const {
      classes,
    } = this.props
    return (
      <Paper elevation={4} className={classes.interCtn}>
        <Grid container align="stretch" justify="space-between" className={classes.grid1}>
          <Grid item xs={4} md={4} className={`${classes.gridItem1} ${classes.textLeft}`}>
            活动规则
          </Grid>
          <Grid item xs={4} md={4} className={`${classes.gridItem1} ${classes.textRight}`}>
            排行榜
          </Grid>
        </Grid>
        <Grid container className={classes.grid2}>
          <Grid item xs={4} md={4} className={`${classes.gridItem2}`}>
            <Button className={`${classes.gridItem2Btn}`} color="inherit" fullWidth>
              <img src={btnMusic} className={classes.gridItem2BtnImgMusic} alt="" />
            </Button>
          </Grid>
          <Grid item xs={4} md={4} className={`${classes.gridItem2}`}>
            <Button className={`${classes.gridItem2Btn}`} color="inherit">
              <img src={btnVideo} className={classes.gridItem2BtnImgVideo} alt="" />
            </Button>
          </Grid>
          <Grid item xs={4} md={4} className={`${classes.gridItem2}`}>
            <Button className={`${classes.gridItem2Btn}`} color="inherit">
              <img src={btnRead} className={classes.gridItem2BtnImgRead} alt="" />
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center" className={classes.grid3}>
          <Grid item className={classes.gridItem3}>
            <Button variant="raised" color="inherit" className={classes.gridItem3Btn}>
              新人特权
            </Button>
          </Grid>
          <Grid item className={classes.gridItem3}>
            <Button variant="raised" color="inherit" className={classes.gridItem3Btn}>
              我为咪咕代言
            </Button>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}
InterComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}
