<template>
  <div class="user-profile">
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" />
    <van-cell-group>

      <van-cell is-link title="头像" @click="onSelectFile">
        <van-image class="avatar" round :src="user.photo"  />
      </van-cell>

      <input type="file" hidden ref="file" @change="onFileChange" />

      <van-cell is-link title="昵称" :value="user.name" @click="isEditNameShow=true" />

      <van-cell is-link title="介绍" value="内容" />

      <van-cell is-link title="性别" :value="user.gender===0?'女':'男'" @click="isEditGenderShow=true" />

      <van-cell is-link title="生日" :value="user.birthday" @click="isEditBirthdayShow=true"/>
    </van-cell-group>

    <!-- 头像预览 -->
    <van-image-preview v-model="isPreviewShow" :images="images" @close="$refs.file.value=''">
      <van-nav-bar
        slot="cover"
        left-text="取消"
        right-text="确定"
        @click-left="isPreviewShow=false"
        @click-right="onUpdataAvatar"
      />
    </van-image-preview>
    <!-- 修改用户昵称 -->
    <van-popup v-model="isEditNameShow" position="bottom">
      <van-nav-bar
        title="编辑昵称"
        left-text="取消"
        right-text="确定"
        @click-left="isEditNameShow=false"
        @click-right="onUpdataName"
      />
      <div>
        <van-field
          :value="user.name"
          @input="inputName = $event"
          rows="2"
          autosize
          type="textarea"
          maxlength="20"
          placeholder="请输入昵称"
          show-word-limit
        />
      </div>
    </van-popup>
    <!-- 修改用户昵称 -->
    <!-- 编辑用户性别 -->
    <van-action-sheet
      v-model="isEditGenderShow"
      :actions="actions"
      cancel-text="取消"
      @cancel="isEditGenderShow=false"
      @select="onGenderSelect"
    />
    <!-- 编辑用户性别 -->
    <!-- 编辑用户生日 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
      <van-datetime-picker
        :value="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isEditBirthdayShow = false"
        @confirm="onUpdateBirthday"
      />
    </van-popup>
    <!-- 编辑用户生日 -->
  </div>
</template>
<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import moment from 'moment'
// import { ImagePreview } from 'vant'
export default {
  name: 'UserProfile',
  components: {},
  props: {},
  data () {
    return {
      user: {}, // 用户资料
      isPreviewShow: false,
      images: [], // 预览的图片列表
      isEditNameShow: false,
      inputName: '', // 输入框的数据
      isEditGenderShow: false,
      actions: [
        { name: '男', value: 1 },
        { name: '女', value: 0 }
      ],
      isEditBirthdayShow: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date()
      // currentDate: new Date()
    }
  },
  // 计算属性
  computed: {
    file () {
      return this.$refs['file']
    },
    currentDate () {
      return new Date(this.user.birthday)
    }
  },
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        console.log(error)
        this.$toast.fail('获取数据失败')
      }
    },
    onSelectFile () {
      // 手动触发input的点击事件
      this.file.click()
    },
    onFileChange () {
      // 预览图片
      // this.file拿到一个dome对象，这个对象有个属性是files
      // this.file.files是一个对象，对象有一个成员是[0]
      const fileObj = this.file.files[0]
      // 使用window.URL.createObjectURL(file)得到文件数据
      const fileData = URL.createObjectURL(fileObj)
      this.images = []
      this.images.push(fileData)// 这里直接重置数据，防止出现多个预览图片
      this.isPreviewShow = true
      // ImagePreview({
      //   images: [fileData], // 预览的图片列表
      //   onClose: this.savePhoto
      // })
    },
    async onUpdataAvatar () {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '保存中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // 手动构造表单对象
        const fd = new FormData()
        fd.append('photo', this.file.files[0])

        // 请求提交
        const { data } = await updateUserPhoto(fd)
        // 更新视图
        this.user.photo = data.data.photo
        // 提示成功
        this.isPreviewShow = false
        this.$toast.success('更新成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('更新失败')
      }
    },
    //   async savePhoto () {
    //     await this.$dialog.confirm({
    //       title: '头像选择',
    //       message: '确认使用该图片作为头像吗？'
    //     })

    //     this.$toast.loading({
    //       duration: 0, // 持续展示toast
    //       message: '保存中...',
    //       forbidClick: true // 是否禁止背景点击
    //     })
    //     // 请求上传
    //     try {
    //       // 通过file-input 获取文件对象
    //       const fileObj = this.file.files[0]
    //       // 构造包含文件的表单对象
    //       const fd = new FormData()
    //       fd.append('photo', fileObj)
    //       // 请求提交
    //       await updateUserPhoto(fd)
    //       // 更新视图
    //       this.user.photo = URL.createObjectURL(fileObj)
    //       // 提示成功
    //       this.$toast.success('保存成功')
    //     } catch (error) {
    //       console.log(error)
    //       this.$toast.fail('保存失败')
    //     }
    //   }
    // field:要修改的数据字段
    // value：数据值
    // 封装修改
    async updateUserProfile (field, value) {
      this.$toast.loading({
        duration: 0, // 持续展示toast
        message: '更新中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        await updateUserProfile({
          [field]: value // 注意属性名使用中括号包裹，否则会当做字符串来使用而不是变量
        })
        this.$toast.success('更新成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('更新失败')
      }
    },
    // 昵称修改
    async onUpdataName () {
      // 请求提交表单
      await this.updateUserProfile('name', this.inputName)
      // 更新视图
      this.user.name = this.inputName
      // 关闭弹层
      this.isEditNameShow = false
    },
    // 性别修改
    async onGenderSelect (data) {
      await this.updateUserProfile('gender', data.value)
      // 更新视图
      this.user.gender = data.value
      // 关闭上拉菜单
      this.isEditGenderShow = false
    },
    // 修改生日
    async onUpdateBirthday (value) {
      // 使用moment把日期对象格式化为指定格式的字符串
      const date = moment(value).format('YYYY-MM-DD')
      // 提交请求
      this.updateUserProfile('birthday', date)
      // 更新视图
      this.user.birthday = date
      // 关闭弹层
      this.isEditBirthdayShow = false
    }
  }
}
</script>
<style scoped lang='less'>
.user-profile {
  .avatar {
    width: 30px;
    height: 30px;
  }
  /deep/.van-image-preview__cover {
    top: unset;
    left: 0;
    right: 0;
    bottom: 0;
    .van-nav-bar {
      background-color: #000;
    }
  }
  .van-popup {
    .van-nav-bar {
      background-color: #fff;
      .van-nav-bar__title {
        color: #323233;
      }
    }
  }
}
.van-icon-arrow-left {
  color: #fff;
}
</style>
