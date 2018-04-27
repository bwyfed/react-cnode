// 对axios做一些封装，这样对API请求时会更加简单些
import axios from 'axios'

// /api/***
const baseUrl = process.env.API_BASE || ''

const parseUrl = (url, params) => {
  const str = Object.keys(params).reduce((result, key) => (`${result}${key}=${params[key]}&`), '')
  return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`
}

export const get = (url, params) => (
  new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params))
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(reject)
  })
)

export const post = (url, params, datas) => (
  new Promise((resolve, reject) => {
    axios.post(parseUrl(url, params), datas)
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(reject)
  })
)
