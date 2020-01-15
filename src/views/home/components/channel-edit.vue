<template>
  <div class="channel-edit">
    <van-cell class="title" title="我的频道" :border="false">
      <van-button size="mini" round type="danger" plain @click="isEditShow=!isEditShow">{{isEditShow?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item v-for="(channel,index) in userChannels" :key="channel.id"  @click='onChannelClick(index)'>
        <span slot='text' class='text' :class="{active:index===active}">{{channel.name}}</span>
        <van-icon v-show="isEditShow && index!==0" slot="icon" name="close" />
      </van-grid-item>
    </van-grid>
    <van-cell class="title" title="频道推荐" :border="false" />
    <van-grid :gutter="10">
      <van-grid-item
        v-for="all in remainingChannels"
        :key="all.id"
        :text="all.name"
        @click="onAdd(all)"
      />
    </van-grid>
  </div>
</template>
<script>
import { getAllChannels } from '@/api/channel'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEditShow: false
    }
  },
  computed: {
    remainingChannels () {
      const channels = []
      const { userChannels, allChannels } = this
      allChannels.forEach(item => {
        if (!userChannels.find(itm => itm.id === item.id)) {
          channels.push(item)
        }
      })
      return channels
    }
  },
  watch: {
    userChannels (newValue) {
      setItem('user-channels', newValue)
    }
  },
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      // console.log(data)
      this.allChannels = data.data.channels
      // console.log(this.allChannels)
    },
    onAdd (all) {
      this.userChannels.push(all)
    },
    onChannelClick (index) {
      if (this.isEditShow && index !== 0) {
        this.userChannels.splice(index, 1)
      } else {
        this.$emit('switch', index)
      }
    }
  }
}
</script>
<style scoped lang='less'>
.channel-edit {
  padding-top: 40px;
}

/deep/ .van-grid-item {
  width: 80px;
  height: 40px;
  position: relative;
  .van-grid-item__icon-wrapper {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 16px;
  }
  .van-grid-item__content {
    background-color: #f4f5f6;
  }
  .text {
    font-size: 12px;
  }
  .active {
    color: red
  }
}
</style>
