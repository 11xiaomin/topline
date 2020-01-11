<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 登录表单 -->
    <!-- 表单验证
    1、使用 ValidationObserver 把需要校验的整个表单包起来
      2、使用 ValidationProvider 把需要校验的具体表单元素包起来，例如 input
      3、通过 ValidationProvider 配置具体的校验规则
        name      配置验证字段的名称
        rules     验证规则
          rules="requried" 单个验证规则
          rules="required|length:4" 多个验证规则使用 | 分隔
        v-slot="{ errors }" 获取错误消息
        如果你需要在JS验证中能马上获取到错误信息，那么必须给每一个ValidationProvider 配置一个immediate
        immediate 立即的  初始验证
    -->
    <ValidationObserver ref="form">
      <ValidationProvider name="手机号" rules="required|mobile" immediate>
        <van-field placeholder="请输入手机号" v-model="user.mobile">
          <van-icon slot="left-icon" class-prefix="icon" name="mobile" />
        </van-field>
        <!-- <span>{{errors[0]}}</span> -->
      </ValidationProvider>
      <ValidationProvider name="验证码" rules="required|code" immediate>
        <van-field placeholder="请输入验证码" v-model="user.code">
          <van-icon slot="left-icon" class-prefix="icon" name="suo" />
          <div class="btn" slot="button">
            <!-- 倒计时 -->
            <van-count-down
              v-if="isCountDownShow"
              :time="1000*60"
              format="ss s"
              @finish="isCountDownShow=false"
            />
            <van-button v-else round slot="button" size="small" type="primary" @click="onCode">发送验证码</van-button>
          </div>
        </van-field>
      </ValidationProvider>
    </ValidationObserver>
    <div class="login-btn-wrap">
      <van-button class="login-btn" type="info" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login, Code } from '@/api/user'
import { validate } from 'vee-validate'
// import request from '@/utils/request'
export default {
  name: 'LoginPage',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isCountDownShow: false // 是否显示倒计时
    }
  },
  methods: {
    async onLogin () {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证
      // this.$refs.form.validate().then(success => {
      //   if (!success) {
      //   }
      // })
      // 调用组件的validate方法
      const success = await this.$refs.form.validate()
      if (!success) {
        console.log('验证失败')
        const errors = this.$refs.form.errors
        for (let key in errors) {
          const item = errors[key]
          if (item[0]) {
            this.$toast(item[0])
            return
          }
        }
        return
      }
      // 开启登录中
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '登录中...',
        forbidClick: true // 是否禁止背景点击
      })
      // 3.请求登录
      try {
        const { data } = await login(user)
        console.log(data)
        // 将登陆成功获取到的用户token相关数据存储到Vuex容器
        this.$store.commit('setUser', data.data)
        // 提示成功
        this.$toast.success('登录成功')
      } catch (error) {
        this.$toast.fail('登录失败，手机号或验证码不正确')
      }
    },

    // 根据后端返回的结果执行后续业务处理
    async onCode () {
      try {
        const { mobile } = this.user
        const validateResult = await validate(mobile, 'required|mobile', {
          name: '手机号'
        })
        if (!validateResult.valid) {
          // console.log(validateResult)
          this.$toast(validateResult.errors[0])
          return
        }
        const res = await Code(mobile)
        console.log(res)
        this.isCountDownShow = true
      } catch (error) {
        console.log(error)
        this.$toast('请勿频繁操作')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login {
  .login-btn-wrap {
    padding: 27px 16px;
    .login-btn {
      width: 100%;
      background-color: #6db4fb;
    }
  }
  .btn {
    padding: 0 10px;
    border-left: 1px solid #ccc;
  }
  .van-cell {
    align-items: center;
  }
}
</style>
