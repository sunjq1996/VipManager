<template name="basics">
  <view>
    <!-- 标题栏 -->
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText"></block>
      <block slot="content">{{houseInfo.house_name||''}}</block>
      <block slot="right">
        <view @tap="onSignoutTextClick" class="padding-lr text-gray na-fn-text">
          <text>登出</text>
        </view>
      </block>
    </cu-custom>
    <view class="margin-top-sm">
      <view class="nav-list">
        <navigator hover-class="none" :url="'/pages/' + item.name"
          class="nav-li" navigateTo :class="'bg-'+item.color"
         :style="[{animation: 'show ' + ((index+1)*0.1+1) + 's 1'}]" v-for="(item,index) in elements" :key="index">
          <view class="nav-title">{{item.title}}</view>
          <view class="nav-name">{{item.name}}</view>
          <text :class="'cuIcon-' + item.cuIcon"></text>
        </navigator>
      </view>
      <view class="cu-tabbar-height"></view>
    </view>
  </view>
</template>

<script>
  import { checkSignin, get_, getHouseId, setHouseId } from '@/utils/index.js'
  export default {
    data() {
      return {
        houseInfo: {},
        elements: [{
            title: '注册',
            name: 'upload',
            color: 'cyan',
            cuIcon: 'roundadd'
          }, {
            title: '查询',
            name: 'search',
            color: 'blue',
            cuIcon: 'search'
          }, {
            title: '通讯录',
            name: 'vips',
            color: 'orange',
            cuIcon: 'addressbook'
          }, {
            title: '记账单',
            name: 'book',
            color: 'purple',
            cuIcon: 'read'
          }
        ],
      }
    },
    onLoad() {
      if (!checkSignin()) {
        uni.redirectTo({ url: './signin' })
      } else {
        console.info('已登录')
        var that = this
        get_('house', getHouseId(), res => {
          console.info(res)
          that.houseInfo = res
        }, err => {
          console.error(err)
        })
      }
    },

    methods: {
      onSignoutTextClick() {
        this.$store.dispatch('app/updateHouseId', '')
        uni.showToast({ title: '退出成功', icon: 'none' })
        uni.redirectTo({ url: './signin' })
      }
    }
  }
</script>

<style>
  page {
    background-color: #FFFFFF;
  }
</style>
