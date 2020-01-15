<template>
  <div class="article-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(article,index) in list" :key="index" :title="article.title" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticleChannels } from '@/api/article'
export default {
  name: 'ArticleList',
  components: {},
  props: {
    // props数据验证
    channel: {
      type: Object, // 必须是对象
      required: true // 必须传递该数据
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null, // 用于获取下一页数据的页码（时间戳）
      isLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getArticleChannels({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1 // 是否包含置顶，进入页面第一次请求是要包含置顶文章，1-包含  0-不包含
      })
      // 把数据添加到列表中
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp // 更新获取下一页数据的时间戳
      } else {
        this.finished = true // 没有数据了，设置加载结束
      }
    },
    async onRefresh () {
      const { data } = await getArticleChannels({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 将数据放到列表的顶部
      const { results } = data.data
      this.list.unshift(...results)
      // 加载状态结束
      this.isLoading = false
      this.$toast(`更新了${results.length}条数据`)
    }
  }
}
</script>
<style scoped></style>
