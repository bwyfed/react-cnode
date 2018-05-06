const axios = require('axios')
const querystring = require('query-string')

const baseUrl = 'https://cnodejs.org/api/v1'

module.exports = function (req, res, next) {
  const path = req.path // 接口地址
  const user = req.session.user || {} // 用户有没有登录
  const needAccessToken = req.query.needAccessToken // 判断接口是否需要accessToken，由?needAccessToken=true传递过来

  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }
  // 不同的请求方法GET和POST上，都携带accesstoken。这里设置GET时携带信息
  const query = Object.assign({}, req.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })
  if (query.needAccessToken) delete query.needAccessToken
  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query, // 传递查询字符串，已经删除了额外的needAccessToken
    data: querystring.stringify(Object.assign({}, req.body, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
    })),
    // Cnode 部分API只能用form格式。把所有数据格式设置为form格式。
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    // 原封不动的返回给客户端
    if (response.status === 200) {
      res.send(response.data)
    } else {
      res.status(response.status).send(response.data)
    }
  }).catch(err => {
    if (err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: '未知错误'
      })
    }
  })
}
