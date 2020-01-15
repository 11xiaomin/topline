<template>
  <div class="search-result">
    <!-- 搜索结果 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearch } from '@/api/search'
export default {
  name: 'searchResult',
  components: {},
  props: {
    q: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getSearch({
        page: this.page,
        per_page: this.perPage,
        q: this.q
      })
      //   将数据添加到列表
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 判断是否还有数据
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
