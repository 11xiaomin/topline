<template>
  <div class="post-comment">
      <!-- 模板中的&event表示绑定事件的事件参数 -->
    <van-field
      :value="value"
      @input="$emit('input', $event)"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button type="primary" class="post-btn" size="small" @click="$emit('click-post')">发布</van-button>
  </div>
</template>
<script>
// import { addComment } from '@/api/comment'
export default {
  name: 'PostComment',
  components: {},
  props: {
    // articleId: {
    //   type: [Object, Number, String],
    //   required: true
    // }
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // async onPost () {
    //   const { data } = await addComment({
    //     target: this.articleId,
    //     content: this.message
    //     // art_id://对文章进行评论，不要传此参数。
    //   })
    //   console.log(data)
    // }
    // 函数通过参数来接收
    // onInput (value) {
    //   this.$emit('input', value)
    // }
  }
}
</script>
<style scoped lang='less'>
.post-comment {
  display: flex;
  padding: 20px;
  align-items: flex-end;
}
</style>
