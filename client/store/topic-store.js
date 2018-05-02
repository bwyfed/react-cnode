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
  @observable createdReplies = [] // 每个话题都新建一个空数组，表示所有回复
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
  @observable details // 数组，有详情的话题列表
  @observable syncing
  @observable createdTopics = []

  constructor({ syncing = false, topics = [], details = [] } = {}) {
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createTopic(topic)))
    this.details = details.map(topic => new Topic(createTopic(topic)))
  }
  // 往topics里面加入新获取的topic
  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }
  // 根据id获取有详情的话题对象
  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail
      return result
    }, {})
  }
  // 获取topics的方法
  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      this.syncing = true
      this.topics = [] // 每次获取topic之前，清空topics，防止在服务端渲染重新执行生命周期函数时，出现大量相同的topic
      get('/topics', {
        mdrender: false, // 告诉Cnode API是否要把markdown字符串渲染成html字符串。这里仍使用markdown
        tab, // 这里之前写错为tabs，传入tab表示获取哪个标签的数据
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
      if (this.detailMap[id]) { // 已经获取了详情数据，不需要重新获取
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
        }).catch(reject)
      }
    })
  }

  // 创建话题
  @action createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post('/topics', {
        needAccessToken: true,
      }, {
        title, tab, content,
      }).then((resp) => {
        if (resp.success) {
          const topic = {
            title,
            tab,
            content,
            id: resp.topic_id,
            create_at: Date.now(),
          }
          this.createdTopics.push(new Topic(createTopic(topic)))
          resolve()
        } else {
          reject()
        }
      }).catch(reject)
    })
  }
}

export default TopicStore
