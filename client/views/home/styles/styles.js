import bg2 from '../images/bg2.png'
// import btnMusic from '../images/btn-music.png'
// import btnVideo from '../images/btn-video.png'
// import btnRead from '../images/btn-read.png'

export const homePrimaryStyle = {
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  bgimg1: {
    display: 'block',
    width: '100%',
    fontSize: 0,
    overflow: 'hidden',
    backgroundColor: 'rgba(251,231,86,0.1)',
  },
  interCtn: {
    width: '90%',
    borderRadius: '4px',
    backgroundImage: `url(${bg2})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  '@media screen and (max-width: 320px)': {
    interCtn: {
      margin: '-24px auto',
    },
  },
  '@media screen and (min-width:321px) and (max-width: 360px)': {
    interCtn: {
      margin: '-27px auto',
    },
  },
  '@media screen and (min-width:361px) and (max-width: 375px)': {
    interCtn: {
      margin: '-28px auto',
    },
  },
  '@media screen and (min-width:376px) and (max-width: 414px)': {
    interCtn: {
      margin: '-32px auto',
    },
  },
  grid1: {
    padding: '10px',
  },
  gridItem1: {
    fontSize: '0.32rem',
    color: '#f0e1ab',
  },
  gridItem2: {
    textAlign: 'center',
  },
  gridItem2Btn: {
    width: '80%',
    height: 'auto',
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    '& span': {
      display: 'block',
      '& img': {
        display: 'block',
        width: '100%',
      },
    },
  },
  gridItem2BtnImgMusic: {
    // backgroundImage: `url(${btnMusic})`,
  },
  gridItem2BtnImgVideo: {
    // backgroundImage: `url(${btnVideo})`,
  },
  gridItem2BtnImgRead: {
    // backgroundImage: `url(${btnRead})`,
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  tab: {
    textAlign: 'center',
    display: 'inline-block',
    padding: '0 6px',
    color: '#fff',
    borderRadius: 3,
    marginRight: 10,
    fontSize: '12px',
  },
}
export default homePrimaryStyle
