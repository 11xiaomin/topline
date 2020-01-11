import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
// 为了方便改存储的名字，所以定义一个变量
const KEY = 'user'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // {token,refresh_token}
    // user: JSON.parse(window.localStorage.getItem('user'))// 当前登录用户状态（token）
    user: getItem(KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
