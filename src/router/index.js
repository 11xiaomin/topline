import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // 有默认子路由不需要配置name
    // name: 'tabbar',
    component: () => import('@/views/tabbar'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'comment',
        name: 'comment',
        component: () => import('@/views/comment')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      }

    ]
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat')
  },
  {
    path: '/user/:userId',
    name: 'user',
    component: () => import('@/views/user')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的props中
    props: true
  },
  {
    // 我的作品
    path: '/my-article/:type?',
    name: 'my-article',
    component: () => import('@/views/user-articles'),
    props: true
  }
  // {
  //   // 我的收藏
  //   path: '/my-article/collect',
  //   name: 'my-article-collect',
  //   component: () => import('@/views/user-articles')
  // },
  // {
  //   // 我的历史
  //   path: '/my-article/history',
  //   name: 'my-article-history',
  //   component: () => import('@/views/user-articles')
  // }
]

const router = new VueRouter({
  routes
})

export default router
