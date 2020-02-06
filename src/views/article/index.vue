<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" fixed />
    <!-- 加载中 -->
    <!-- 加载中 -->
    <van-loading v-if="loading" class="loading" color="#1989fa" vertical>
      <slot>加载中...</slot>
    </van-loading>
    <!-- /加载中 -->
    <!-- 文章详情 -->
    <div v-else-if="article.title" class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author-wrap">
        <div class="base-info">
          <van-image class="avatar" round fit="cover" :src="article.aut_photo" />
          <div class="text">
            <p class="name">{{article.aut_name}}</p>
            <p class="time">{{article.pubdate |Time}}</p>
          </div>
        </div>
        <!-- 如果用户没有登录或者文章作者不是当前登录用户 -->
        <!-- v-if="!$store.state.user||article.aut_id!==$store.state.user.id" -->
        <van-button
          v-if="!user||article.aut_id!==user.id"
          class="follow-btn"
          :type="article.is_followed?'default':'info'"
          size="small"
          :loading="isFollowLoading"
          round
          @click="onFollow"
        >{{article.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <!-- 文章内容 -->
      <div class="markdown-body" v-html="article.content"></div>
      <!-- 文章评论 -->
      <article-comment ref='article-comment' :article-id="articleId" @click-reply="onReplyShow"></article-comment>
    </div>
    <!-- 文章详情 -->
    <!-- 加载失败提示 -->
    <div v-else class="error">
      <img src="./no-network.png" alt="no-network" />
      <p class="text">亲，网络不给力哦~</p>
      <van-button class="btn" type="default" size="small" @click="loadArticle">点击重试</van-button>
    </div>
    <!-- /加载失败提示 -->
    <!-- 底部区域 -->
    <div class="footer">
      <van-button class="write-btn" type="default" round size="small" @click="isPostShow=true">写评论</van-button>
      <van-icon class="comment-icon" name="comment-o" info="9" />
      <van-icon color="orange" :name="article.is_collected?'star':'star-o'" @click="onCollect" />
      <van-icon
        color="#e5645f"
        :name="article.attitude===1?'good-job':'good-job-o'"
        @click="onLike"
      />
      <van-icon class="share-icon" name="share" />
    </div>
    <!-- /底部区域 -->
    <!-- 发布文章评论 -->
    <van-popup v-model="isPostShow" position="bottom" :style="{ height: '20%' }">
      <post-comment v-model="postMessage" @click-post="onPost"></post-comment>
    </van-popup>
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" :style="{ height: '80%' }">
      <comment-reply :comment='currentComment' :article-id="articleId"/>
      <!-- <post-comment v-model="postMessage" @click-post="onPost"></post-comment> -->
    </van-popup>
  </div>
</template>
<script>
import {
  getArticleId,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user'
import ArticleComment from './compontent/article-comments'
import PostComment from './compontent/post-comment'
import CommentReply from './compontent/comment-reply'
// vuex中提供的辅助方法
import { mapState } from 'vuex'
import { addComment } from '@/api/comment'

export default {
  name: 'ArticlePage',
  components: {
    ArticleComment,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true,
      isFollowLoading: false, // 关注按钮的loading状态
      isPostShow: false, // 发布评论的弹层是否显示
      postMessage: '', // 发布评论内容
      isReplyShow: false, // 展示评论回复弹层
      currentComment: {}// 点击回复的那个评论项
    }
  },
  // 在第8天视频第6中
  computed: {
    // 方法（二）
    ...mapState(['user'])
  },
  // computed: {
  // 获取容器中的数据（方法一）
  //   user () {
  //     return this.$store.state.user
  //   }
  // },
  watch: {},
  created () {
    // console.log('article created')
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleId(this.articleId)
        // console.log(data)
        this.article = data.data
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 收藏
    async onCollect () {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        if (this.article.is_collected) {
          await deleteCollect(this.articleId)
          this.article.is_collected = false
          this.$toast.success('取消收藏')
        } else {
          await addCollect(this.articleId)
          this.article.is_collected = true
          this.$toast.success('收藏成功')
        }
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
    },
    // 点赞
    async onLike () {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        if (this.article.attitude === 1) {
          await deleteLike(this.articleId)
          this.article.attitude = -1
          this.$toast.success('取消点赞')
        } else {
          await addLike(this.articleId)
          this.article.is_collected = 0
          this.$toast.success('点赞成功')
        }
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
    },
    // 关注
    async onFollow () {
      this.isFollowLoading = true
      try {
        const authorId = this.article.aut_id
        if (this.article.is_followed) {
          await deleteFollow(authorId)
        } else {
          // 添加关注
          await addFollow(authorId)
        }
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
      this.isFollowLoading = false
    },
    async onPost () {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const { data } = await addComment({
          target: this.articleId,
          content: this.postMessage
          //     // art_id://对文章进行评论，不要传此参数。
        })
        console.log(data)
        // 清空文本框
        this.postMessage = ''
        // 关闭弹层
        this.isPostShow = false
        // 将数据添加到列表中
        this.$refs['article-comment'].list.unshift(data.data.new_obj)
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发布失败')
      }
    },
    onReplyShow (comment) {
      // 将点击回复所在的评论对象记录起来
      this.currentComment = comment
      // 展示回复的弹层
      this.isReplyShow = true
    }
  }
}
</script>
<style scoped lang='less'>
@import "./github-markdown.css";

.article-container {
  padding: 46px 20px 50px;
  background: #fff;
  .van-nav-bar__arrow {
    color: #fff !important;
  }
  .loading {
    padding-top: 100px;
    text-align: center;
  }
  .detail {
    .title {
      margin: 0;
      padding-top: 24px;
      font-size: 20px;
      color: #3a3a3a;
    }
    .author-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      height: 40px;
      .base-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
        .text {
          line-height: 1.5;
          .name {
            margin: 0;
            font-size: 14px;
          }
          .time {
            margin: 0;
            font-size: 12px;
            color: #999;
          }
        }
      }
      .follow-btn {
        width: 85px;
      }
    }
  }
  .error {
    padding-top: 100px;
    text-align: center;
    .text {
      font-size: 15px;
    }
    .btn {
      width: 30%;
    }
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
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
}
</style>
