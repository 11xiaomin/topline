import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载验证插件的初始配置
import './utils/validation.js'
// rem适配
import 'amfe-flexible'
import './utils/register'
import './styles/index.less'

// 加载初始日期时间库
import './utils/datetime'
// // 加载
// import { Button, Icon } from 'vant'
// // 注册
// Vue.use(Button).use(Icon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
