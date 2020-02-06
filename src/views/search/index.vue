<template>
  <div class="search-container">
    <!-- 搜索 -->
    <form class="search-from" action="/">
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchContent)"
        @cancel="onCancel"
        @focus="isResultShow=false"
        @input="onSearchImput"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :q="searchContent"></search-result>
    <!-- 联想建议 -->
    <van-cell-group v-else-if="searchContent">
      <van-cell
        icon="search"
        v-for="(item,index) in suggestions"
        :key="index"
        @click="onSearch(item)"
      >
        <div slot="title" v-html="highlight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template v-if="isDeleteShow">
          <span class='all' @click='searchHistories=[]'>全部删除</span>
          <span @click='isDeleteShow=false'>完成</span>
        </template>
        <van-icon name="delete" v-else @click="isDeleteShow=true"/>
      </van-cell>
      <van-cell :title="item" v-for="(item,index) in searchHistories" :key="index" @click='HistoryClick(item,index)'>
        <van-icon v-show="isDeleteShow" name="close"></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script>
import SearchResult from './components/search-result'
import { getSuggestions } from '@/api/search'
import { debounce } from 'lodash'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'Search',
  components: {
    SearchResult
  },
  props: {},
  data () {
    return {
      searchContent: '',
      isResultShow: false, // 是否显示搜索结果
      suggestions: [], // 联想建议
      // 如果有数据就用   如果没有就返回空数组
      searchHistories: getItem('searchHistories') || [], // 添加数据存储历史记录
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      setItem('searchHistories', val)// 也可以用this.searchHistories和val是同一个东西
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (q) {
      // 更新搜索文本框的数据
      this.searchContent = q
      // 记录搜索历史记录
      const searchHistories = this.searchHistories
      // indexOf 是指查看是否存在某个值
      const index = searchHistories.indexOf(q)
      if (index !== -1) {
        searchHistories.splice(index)
      }
      searchHistories.unshift(q)
      // 展示搜索的结果
      this.isResultShow = true
    },
    onCancel () {
      console.log('onCancel')
    },
    // debounce防抖函数
    // 参数1: 函数  参数2: 防抖时间
    onSearchImput: debounce(async function () {
      const searchContent = this.searchContent
      // console.log(searchContent)
      if (!searchContent) {
        return
      }
      // 请求获取数据
      const { data } = await getSuggestions(searchContent)
      // 将数据添加到组件实例中
      this.suggestions = data.data.options
      // 模板绑定
    }, 200),
    // async onSearchImput () {
    //   const searchContent = this.searchContent
    //   // console.log(searchContent)
    //   if (!searchContent) {
    //     return
    //   }
    //   // 请求获取数据
    //   const { data } = await getSuggestions(searchContent)
    //   // 将数据添加到组件实例中
    //   this.suggestions = data.data.options
    //   // 模板绑定
    // },
    highlight (str) {
      const searchContent = this.searchContent
      // console.log(searchContent)
      const reg = new RegExp(searchContent, 'gi')
      return str.replace(
        reg,
        `<span style="color:#3296fa">${searchContent}</span>`
      )
    },
    HistoryClick (item, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        this.onSearch(item)
      }
    }
  }
}
</script>
<style scoped lang='less'>
.search-container {
  padding-top: 40px;
  .search-from {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    .van-search--show-action {
      background-color: #3296fa !important;
    }
  }
  .van-hairline--top-bottom {
    margin-top: 10px;
  }
  .van-search__action {
    color: #fff;
  }
  .all {
    margin-right: 5px;
  }
}
</style>
