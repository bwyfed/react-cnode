import {
  observable,
  // toJS,
  computed,
  action,
  extendObservable,
} from 'mobx'
import { topicSchema, replySchema } from '../util/variable-define'
import { get, post } from '../util/http'
// 默认的值是topicSchema，传入的值是topic，返回一个所有字段都有定义的topic对象
const createTopic = topic => Object.assign({}, topicSchema, topic)

const createReply = reply => Object.assign({}, replySchema, reply)
// 每个话题都放在这个类中。这样便于扩展
class Topic {
  constructor(data) {
    extendObservable(this, data) // 是data的所有属性为reactive
    // this.isDetail = isDetail
  }
  @observable syncing = false
  @observable createdReplies = []
  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true,
      }, { content })
        .then((resp) => {
          if (resp.success) {
            this.createdReplies.push(createReply({
              id: resp.reply_id,
              content,
              create_at: Date.now(),
            }))
            resolve()
          } else {
            reject(resp)
          }
        })
        .catch(reject)
    })
  }
}
// TopicStore类是和话题相关的数据
class TopicStore {
  @observable topics
  @observable details
  @observable syncing

  constructor({ syncing = false, topics = [], details = [] } = {}) {
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createTopic(topic)))
    this.details = details.map(topic => new Topic(createTopic(topic)))
  }
  // 往topics里面加入新获取的topic
  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }

  @computed get detailMap() {
    return this.details.reduce(() => {
      /*
      result[detail.id] = detail
      return detail
      */
      // 这一块如何写？
      const a = 1; const b = 2;
      return { a, b }
    }, {})
  }
  // 获取topics的方法
  @action fetchTopics() {
    return new Promise((resolve, reject) => {
      this.syncing = true
      this.topics = [] // 每次获取topic之前，清空topics，防止在服务端渲染重新执行生命周期函数时，出现大量相同的topic
      get('/topics', {
        mdrender: false, // 告诉Cnode API是否要把markdown字符串渲染成html字符串。这里仍使用markdown
        // tabs,
      }).then((resp) => {
        if (resp.success) {
          resp.data.forEach((topic) => {
            this.addTopic(topic)
          })
          resolve()
        } else {
          reject()
        }
        this.syncing = false
      }).catch((err) => {
        reject(err)
        this.syncing = false
      })
    })
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id])
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data))
            this.details.push(topic)
            resolve(topic)
          } else {
            reject()
          }
        })
      }
    })
  }
}

export default TopicStore
