<template>
  <div class="collect-container">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(article,index) in list" :key="index" :title="article.title"
      @click="$router.push({
        name:'article',
        params:{
          articleId:article.art_id.toString()
        }
      })"/>
    </van-list>
  </div>
</template>
<script>
import { getHistoryArticles } from '@/api/article'
export default {
  name: 'Collect',
  components: {},
  props: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      //  请求获取数据
      const { data } = await getHistoryArticles({
        page: this.page,
        per_page: this.perPage
      })
      // 将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false
      //   判断是否还有数据
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>
<style scoped></style>
