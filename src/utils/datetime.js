//  日期时间处理
import moment from 'moment'
import Vue from 'vue'
// 配置中文语言
// 查看moment/locale 中的语言文件，使用文件名
moment.locale('zh-cn')

Vue.filter('Time', value => {
//   console.log(value)
//   return 'hello'
  return moment(value).startOf('hour').fromNow()
})
