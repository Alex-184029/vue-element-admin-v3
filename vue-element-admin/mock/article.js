const Mock = require('mockjs')
const moment = require("moment");
const List = []
const count = 16

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

const randomDate = (startDate, endDate) => {
  let date = new Date(+startDate + Math.random() * (endDate - startDate));
  let hour = (0 + Math.random() * (23 - 0)) | 0;
  let minute = (0 + Math.random() * (59 - 0)) | 0;
  let second = (0 + Math.random() * (59 - 0)) | 0;
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(second);
  return date;
};
// 生产当月的开始日期
const startDate = new Date("2023-06-01 00:00:00");
// 截止日期
const endDate = new Date("2023-11-11 17:00:00");

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'GraphSAGE-LSTMv3.0',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['读写'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(1, 20)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'WangXingan',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['读写'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(1, 20)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'YangJie',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['读写'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(1, 20)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'JiWeiping',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['读写'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(1, 20)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'LiuShuzhi',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['读写'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(1, 20)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'XieLin',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['读写'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(1, 20)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'QiuShuang',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['读写'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(1, 20)',
//   image_uri,
//   platforms: ['a-platform']
// }))

List.push(Mock.mock({
  id: '@increment',
  // timestamp: +Mock.Random.date('T'),
  timestamp:  moment(randomDate(startDate, endDate)).format(
    "YYYY-MM-DD HH:mm:ss"),

  author: '@first',
  reviewer: '@first',
  title: 'A项目',
  content_short: 'mock data',
  content: baseContent,
  forecast: '@float(0, 100, 2, 2)',
  importance: '@integer(1, 3)',
  'type|1': ['CN', 'US', 'JP', 'EU'],
  'status|1': ['已完成'],
  display_time: '@datetime',
  comment_disabled: true,
  pageviews: '@integer(300, 5000)',
  image_uri,
  platforms: ['a-platform']
}))



List.push(Mock.mock({
  id: '@increment',
  // timestamp: +Mock.Random.date('T'),
  timestamp:  moment(randomDate(startDate, endDate)).format(
    "YYYY-MM-DD HH:mm:ss"),

  author: '@first',
  reviewer: '@first',
  title: 'B项目（一期）',
  content_short: 'mock data',
  content: baseContent,
  forecast: '@float(0, 100, 2, 2)',
  importance: '@integer(1, 3)',
  'type|1': ['CN', 'US', 'JP', 'EU'],
  'status|1': ['已完成'],
  display_time: '@datetime',
  comment_disabled: true,
  pageviews: '@integer(300, 5000)',
  image_uri,
  platforms: ['a-platform']
}))



List.push(Mock.mock({
  id: '@increment',
  // timestamp: +Mock.Random.date('T'),
  timestamp:  moment(randomDate(startDate, endDate)).format(
    "YYYY-MM-DD HH:mm:ss"),

  author: '@first',
  reviewer: '@first',
  title: 'C项目5.2期',
  content_short: 'mock data',
  content: baseContent,
  forecast: '@float(0, 100, 2, 2)',
  importance: '@integer(1, 3)',
  'type|1': ['CN', 'US', 'JP', 'EU'],
  'status|1': ['已完成'],
  display_time: '@datetime',
  comment_disabled: true,
  pageviews: '@integer(300, 5000)',
  image_uri,
  platforms: ['a-platform']
}))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'D装修工程',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['已完成'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(300, 5000)',
//   image_uri,
//   platforms: ['a-platform']
// }))



// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'E装修（二期）',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['已完成'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(300, 5000)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// List.push(Mock.mock({
//   id: '@increment',
//   // timestamp: +Mock.Random.date('T'),
//   timestamp:  moment(randomDate(startDate, endDate)).format(
//     "YYYY-MM-DD HH:mm:ss"),

//   author: '@first',
//   reviewer: '@first',
//   title: 'F精装项目工程',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['已完成'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(300, 5000)',
//   image_uri,
//   platforms: ['a-platform']
// }))

// const currentTime = new Date();


// List.push(Mock.mock({
//   id: '@increment',
//   timestamp: currentTime.getTime(),
//   // timestamp: moment(randomDate(startDate, endDate)).format(
//   //   "YYYY-MM-DD HH:mm:ss"),
//   author: '@first',
//   reviewer: '@first',
//   title: 'G图纸',
//   content_short: 'mock data',
//   content: baseContent,
//   forecast: '@float(0, 100, 2, 2)',
//   importance: '@integer(1, 3)',
//   'type|1': ['CN', 'US', 'JP', 'EU'],
//   'status|1': ['处理中'],
//   display_time: '@datetime',
//   comment_disabled: true,
//   pageviews: '@integer(300, 5000)',
//   image_uri,
//   platforms: ['a-platform']
// }))


module.exports = [
  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

