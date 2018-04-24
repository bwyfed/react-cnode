/**
 * Created by Hello on 2018/4/22.
 */
const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'
// 登录接口
router.post('/login', function (req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then(response => {
      if (response.status === 200 && response.data.success) {
        // 在req.session上存放数据user，保存接口返回登录信息
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: response.data.loginname,
          id: response.data.id,
          avatarUrl: response.data.avatar_url
        }
        res.json({
          success: true,
          data: response.data
        })
      }
    })
    .catch(err => {
      if (err.response) { // 接口有返回，是业务逻辑的错误
        res.json({
          success: false,
          data: err.response.data
        })
      } else {
        next(err)   //把错误抛给全局错误处理器来处理
      }
    })
})

module.exports = router
