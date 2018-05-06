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
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        // 在req.session上存放数据user，保存接口返回登录信息
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url
        }
        res.json({
          success: true,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if (err.response) { // 接口有返回，是业务逻辑的错误
        res.json({
          success: false,
          data: err.response.data // err.response是个非常大的对象，无法串行化
        })
      } else {
        next(err) // 把错误抛给全局错误处理器来处理
      }
    })
})

module.exports = router
