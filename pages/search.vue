<template>
  <view>
    <!-- 标题栏 -->
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText"></block>
      <block slot="content"> 客户查询 </block>
      <block slot="right">
        <view class="padding-lr text-gray na-fn-text">
          <navigator url="index" open-type="redirect">
            <text class="cuIcon-home"></text>
          </navigator>
        </view>
      </block>
    </cu-custom>
    <view class="cu-bar search bg-white">
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input @confirm="onSearchBtnClick" v-model="phone" maxlength="11" :adjust-position="false" type="number"
          placeholder="输入客户手机号搜索" confirm-type="search"></input>
      </view>
      <view class="action">
        <button @tap="onSearchBtnClick" class="cu-btn bg-blue shadow-blur round">搜索</button>
      </view>
    </view>
    <scroll-view scroll-x class="bg-white nav text-center margin-bottom-sm" v-show="found">
      <view class="cu-item" :class="index===resIdx?'text-blue cur':''" v-for="(item,index) in resPicker" :key="index"
        @tap="resIdx=index" :data-id="index">{{resPicker[index]}}</view>
    </scroll-view>
    <scroll-view scroll-x>
      <view class="cu-item padding-lr-sm bg-white">
        <view class="cu-list menu" v-if="found&&resIdx===0">
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-myfill text-red"></text>
              <text class="text-grey">客户姓名</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_name||''}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-addressbook text-olive"></text>
              <text class="text-grey">联系方式</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_phone||''}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-calendar text-orange"></text>
              <text class="text-grey">注册日期</text>
            </view>
            <view class="action">
              <text>{{vipInfo.createdAt?vipInfo.createdAt:''}}</text>
            </view>
          </view>
          <view class="cu-item margin-top-sm na-list-item">
            <view class="content">
              <text class="text-pink" :class="vipInfo.v_sex==='男'?'cuIcon-male':'cuIcon-female'"></text>
              <text class="text-grey">性别</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_sex||''}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-crown text-yellow"></text>
              <text class="text-grey">生日</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_birthday?vipInfo.v_birthday.iso.split(' ')[0]:''}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-location text-blue"></text>
              <text class="text-grey">家庭住址</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_addr||''}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-mobilefill text-cyan"></text>
              <text class="text-grey">QQ/微信</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_qq_wx_id||''}}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="cu-item padding-lr-sm bg-white">
        <view class="cu-list menu" v-if="found&&resIdx===1">
          <!-- 类型 -->
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-apps text-brown"></text>
              <text class="text-grey">类型</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_type||''}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-card text-orange"></text>
              <text class="text-grey">储值卡号</text>
            </view>
            <view class="action">
              <text>{{vipInfo.objectId||''}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-moneybagfill text-red"></text>
              <text class="text-grey">卡金</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_sum||0}}</text>
            </view>
          </view>
          <view class="cu-item na-list-item">
            <view class="content">
              <text class="cuIcon-friendfavor text-pink"></text>
              <text class="text-grey">消费折扣</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_rebate||0}}</text>
            </view>
          </view>
          <view class="cu-item margin-top-sm na-list-item">
            <view class="content">
              <text class="cuIcon-text text-olive"></text>
              <text class="text-grey">备注</text>
            </view>
            <view class="action">
              <text>{{vipInfo.v_remark||''}}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="cu-bar bg-white tabbar foot box-shadow" v-show="found">
      <view class="action na-fn-text">
        <navigator :url="'upload?id='+vipInfo.objectId" open-type="navigate">
          <view class='cuIcon-cu-image'>
            <view class="cuIcon-formfill text-red"></view>
          </view>
          <view class="text-bold">编辑</view>
        </navigator>
      </view>
      <view class="action na-fn-text" @tap="onTextDeleteClick">
        <view class='cuIcon-cu-image'>
          <view class="cuIcon-deletefill text-olive"></view>
        </view>
        <view class="text-bold">删除</view>
      </view>
      <view class="action na-fn-text">
        <navigator :url="'bill?id='+vipInfo.objectId" open-type="navigate">
          <view class='cuIcon-cu-image'>
           <view class="cuIcon-roundaddfill text-yellow"></view>
          </view>
          <view class="text-bold">记账</view>
        </navigator>
      </view>
      <view class="action na-fn-text">
        <navigator :url="'record?id='+vipInfo.objectId" open-type="navigate">
          <view class='cuIcon-cu-image'>
            <view class="cuIcon-list text-cyan"></view>
          </view>
          <view class="text-bold">账单</view>
        </navigator>
      </view>
    </view>
    <na-modal-confirm ref="modalDeleteConfirm"></na-modal-confirm>
  </view>
</template>

<script>
  import { search_, delete_ } from '@/utils/index.js'
  import naModalConfirm from '@/components/na-modal-confirm/na-modal-confirm.vue'
  export default {
  components: { naModalConfirm },
    data() {
      return {
        searching: false,
        found: false,
        phone: '',
        vipInfo: {},
        resIdx: 0,
        resPicker: ['客户', '会员卡']
      }
    },
    onLoad(options) {
      if (options.phone) {
        this.phone = options.phone
        this.onSearchBtnClick()
      }
    },
    onPullDownRefresh() {
      this.onSearchBtnClick()
      uni.stopPullDownRefresh()
    },
    methods: {
      // 校验关键字
      checkKeyWord() {
        if (!this.phone) {
          uni.showToast({ title: '手机号码不能为空！', icon: 'none' })
          return false
        } else if (this.phone.length !== 11) {
          uni.showToast({ title: '请输入有效的手机号码！', icon: 'none' })
          return false
        } else {
          return true
        }
      },
      // 搜索用户
      onSearchBtnClick() {
        console.log('onSearchBtnClick is called')
        if (!this.checkKeyWord()) {
          return
        }
        if (this.searching) {
          uni.showToast({ title: '正在搜索...', icon: 'none' })
          return
        }
        this.searching = true
        this.found = false
        var that = this
        var houseId = this.$store.state.app.houseId
        search_('vip', [{
          key: 'v_house_id', option: '==', value: houseId
        }, {
          key: 'v_phone', option: '==', value: this.phone
        }], 0, 1, res => {
          console.info(res)
          that.searching = false
          if (res.length) {
            that.vipInfo = res[0]
            that.found = true
          } else {
            uni.showToast({ title: '未查询到客户信息', icon: 'none' })
          }
        }, err => {
          console.error(err)
          uni.showToast({ title: '客户信息查询失败，请重试', icon: 'none' })
          that.searching = false
        })
      },

      // 删除用户
      onTextDeleteClick() {
        var that = this
        this.$refs.modalDeleteConfirm.showModal({
          title: '确认删除客户信息？',
          confirmCallback: () => {
            delete_('vip', that.vipInfo.objectId, (res) => {
              console.info(res)
              uni.showToast({ title: '客户信息删除成功', icon: 'none' })
              that.found = false
            }, (err) => {
              console.error(err)
              uni.showToast({ title: '客户信息删除失败，请重试', icon: 'none' })
            })
          }
        })
      }
    }
  }
</script>

<style>
  page {
    background-color: #F7F7F7;
  }
  .na-fn-text {
    color: #666666;
  }
  .na-fn-text:active {
    color: #F0AD4E;
  }
  .na-list-item {
    
  }
  .na-list-item:hover {
    background-color: #F7F7F7;
    /* border: 1upx solid #0081FF; */
  }
</style>
