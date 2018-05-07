import React from 'react'
// import PropTypes from 'prop-types'
import Container from '../layout/container'
import BgComponent from '../layout/bg-component'

export default class ActivityRule extends React.Component {
  constructor() {
    super()
    this.state = {
      id: 0,
      time: {
        title: '一、活动时间：',
        content: [
          '2017年5月13日-2017年7月31日',
        ],
      },
      target: {
        title: '二、活动对象：',
        content: [
          '江苏省内移动用户',
        ],
      },
      detail: {
        title: '三、活动内容：',
        content: [
          '用户通过活动页面选择对应关卡进行挑战，挑战成功后并在当天成功登录客户端，即可获得对应奖品，每个用户活动期间每关只能参与一次，每关奖品可领一次，奖品数量有限，送完即止。',
        ],
      },
      award: {
        title: '四、奖项设置：',
        content: [],
      },
    }
  }
  componentDidMount() {
    // do something here
    const createdData = [
      this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
      this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
      this.createData('Eclair', 262, 16.0, 24, 6.0),
      this.createData('Cupcake', 305, 3.7, 67, 4.3),
      this.createData('Gingerbread', 356, 16.0, 49, 3.9),
    ]
    this.state.award.content = createdData;
  }

  createData(name, calories, fat, carbs, protein) {
    this.state.id += 1;
    return {
      id: this.state.id,
      name,
      calories,
      fat,
      carbs,
      protein,
    }
  }

  render() {
    return (
      <Container>
        <BgComponent />
        <div className="time">
          {this.state.time.title}
        </div>
        <div className="target">
          {this.state.target.title}
        </div>
        <div className="detail">
          {this.state.detail.title}
        </div>
        <div>
          {
            this.state.award.content.map(n => (
              <div>
                <span>{n.name}</span>
                <span>{n.calories}</span>
                <span>{n.fat}</span>
              </div>
            ))
          }
        </div>
      </Container>
    )
  }
}
