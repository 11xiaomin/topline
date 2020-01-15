<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed></van-nav-bar>
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <!-- v-model="active"  控制激活的标签 -->
    <van-tabs v-model="active">
      <van-icon class="wap-nav" slot="nav-right" name="wap-nav" @click="isChannelShow=true"></van-icon>
      <van-tab :title="channel.name" v-for="channel in userChannels" :key="channel.id">
        <!-- 文章列表 -->
        <article-list :channel="channel"></article-list>
        <!-- 文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- 频道列表 -->
    <!-- 编辑频道 -->
    <van-popup
      v-model="isChannelShow"
      closeable
      round
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <channel-edit :userChannels="userChannels" @switch="onChannelSwitch" :active="active" />
    </van-popup>
    <!-- 编辑频道 -->
  </div>
</template>
<script>
import { getChannels, getAllChannels } from '@/api/channel'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0, // 控制激活的标签页
      userChannels: [], // 用户频道列表
      isChannelShow: false
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadUserChannels()
  },
  mounted () {},
  methods: {
    async loadUserChannels () {
      try {
        let channels = []
        const localUserChannels = getItem('user-channels')
        if (localUserChannels) {
          channels = localUserChannels
        } else {
          const { data } = await getChannels()
          // console.log(data)
          channels = data.data.channels
          // this.userChannels = data.data.channels
          // console.log(this.userChannels)
        }
        this.userChannels = channels
      } catch (error) {
        console.log(error)
        this.$toast('获取频道列表失败')
      }
    },
    onChannelSwitch (index) {
      this.active = index // 切换激活频道
      this.isChannelShow = false
    }
  }
}
</script>
<style scoped lang="less">
.home-container {
  padding-top: 80px;
  padding-bottom: 45px;
}

.wap-nav {
  position: fixed;
  right: 0;
  line-height: 40px;
  background-color: #fff;
  opacity: 0.8;
}

/deep/ .van-tabs__wrap {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
