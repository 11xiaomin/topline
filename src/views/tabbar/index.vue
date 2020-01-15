<template>
<div class='tabbar-container'>
    <router-view></router-view>
    <!-- route 开启路由模式 -->
    <van-tabbar route>
  <van-tabbar-item icon="wap-home-o" to='/'>首页</van-tabbar-item>
  <van-tabbar-item icon="comment-o" to='comment'>问答</van-tabbar-item>
  <van-tabbar-item icon="video-o" to='video'>视频</van-tabbar-item>
  <van-tabbar-item icon="user-o" to='my'>
    {{$store.state.user?'我的':'未登录'}}
  </van-tabbar-item>
</van-tabbar>
</div>
</template>
<script>
export default {
  components: {},
  props: {},
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style scoped></style>
