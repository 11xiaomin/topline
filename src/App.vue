<template>
  <div id="app">
    <!--
      <keep-alive> 专门用来缓存组件的 是vue本身内置的一个组件
      exclude 配置哪些组件不要缓存
      include 相反
    -->
    <keep-alive :include="$store.state.cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      cachePages: ['TabBar']
    }
  }
}
</script>

<style lang="less">
</style>
