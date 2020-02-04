<template>
  <div class="comment-reply">
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" />
    </van-nav-bar>
    <!-- 当前评论 -->
    <comment-item :comment="comment" />
    <van-cell title="所有回复"></van-cell>
    <!-- 回复列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 列表评论 -->
      <comment-item
      :comment="comment"
      v-for="(comment,index) in list"
      :key="index"
      />
    </van-list>
    <!-- 底部区域 -->
    <div class="footer">
      <van-button class="write-btn" type="default" round size="small" @click="isPostShow=true">写评论</van-button>
      <van-icon
        color="#e5645f"
        name="good-job"
      />
    </div>
    <!-- /底部区域 -->
    <!-- 发布回复 -->
   <van-popup v-model="isPostShow" position="bottom">
     <post-comment v-model="postMessage" @click-post="onPost"/>
   </van-popup>
  </div>
</template>
<script>
import CommentItem from './comment-item'
import { getComments, addComment } from '@/api/comment'
import PostComment from './post-comment'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    PostComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Object, String, Number],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 20,
      isPostShow: false,
      postMessage: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getComments({
        type: 'c',
        source: this.comment.com_id.toString(),
        offset: this.offset,
        limit: this.limit
      })
      // 将数据添加到列表
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false
      // 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },
    async onPost () {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const { data } = await addComment({
          target: this.comment.com_id.toString(),
          content: this.postMessage,
          //     // art_id://对文章进行评论，不要传此参数。
          art_id: this.articleId
        })
        console.log(data)
        // 清空文本框
        this.postMessage = ''
        // 关闭弹层
        this.isPostShow = false
        // 将数据添加到列表中
        this.list.unshift(data.data.new_obj)
        // 更新回复的总数量
        this.comment.reply_count++
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>
<style scoped lang="less">
.van-icon-cross {
  color: #fff;
}
.footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .write-btn {
      width: 160px;
    }
    .van-icon {
      font-size: 20px;
    }
}
</style>
