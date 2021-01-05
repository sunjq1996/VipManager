<template>
  <view>
    <!-- 标题栏 -->
    <cu-custom bgColor="bg-white" :isBack="false">
      <block slot="backText"></block>
      <block slot="content">登录</block>
<!--      <block slot="right">
        <view class="padding-lr text-gray">
          <navigator url="signup" open-type="navigate">
            <text>注册</text>
          </navigator>
        </view>
      </block> -->
    </cu-custom>
    <view class="flex justify-center margin-top-xl">
      <view class="cu-avatar lg round bg-blue">V</view>
    </view>

    <view class="margin-sm">
      <form>
        <!-- 店主手机号 -->
        <view class="cu-form-group">
          <view class="title text-blue">+86</view>
          <input v-model="phone" maxlength="11" type="number" placeholder="请输入手机号码" name="input"></input>
        </view>
        <!-- 店铺密码 -->
        <view class="cu-form-group">
          <!-- <view class="title">密码</view> -->
          <input v-model="password" maxlength="16" type="password" placeholder="请输入密码" name="input"></input>
        </view>
      </form>
      <view class="padding flex flex-direction margin-top-sm">
        <button @tap="onSignin" :class="checkInput?'check':'nocheck'" class="cu-btn bg-blue margin-tb-sm lg btn-signin">登录</button>
      </view>
    </view>
    <view class="cu-bar foot">
      <view class="action"></view>
      <view class="action">
        <!-- <text class="text-grey padding-right-sm signin-fn-text">微信登录</text> -->
<!--        <text class="text-grey padding-right-sm solid-left solid-right signin-fn-text">忘记密码</text>
        <navigator url="signup" open-type="navigate">
          <text class="text-grey padding-left-sm">账号注册</text>
        </navigator> -->
      </view>
      <view class="action"></view>
    </view>
  </view>
</template>

<script>
  import { search_ } from '@/utils/index.js'
  export default {
    data() {
      return {
        checking: false,
        phone: '',
        password: '',
        toast: false
      }
    },
    methods: {
      // 登录
      onSpace() {
        console.log('onSpace is called')
      },
      onSignin() {
        console.log('onSignin is called')
        this.toast = true
        if (!this.checkInput){
          this.toast = false
          return
        }
        if (this.checking) {
          uni.showToast({ title: '正在验证...', icon: 'none' })
          return
        }
        this.checking = true
        // 查询条件
        const condition = [
          {
            'key': 'house_manager_phone',
            'option': '==',
            'value': this.phone
          },
          {
            'key': 'house_password',
            'option': '==',
            'value': this.password
          },
        ]
        var that = this
        search_('house', condition, 0, 1, (res) => {
          that.checking = false
          if (res.length) {
            console.info('登录成功：', res)
            uni.showToast({ title: '登录成功', icon: 'none' })
            that.$store.dispatch('app/updateHouseId', res[0].objectId)
            uni.redirectTo({ url: './index' })
          } else {
            uni.showToast({ title: '用户名或密码错误', icon: 'none' })
          }
        }, (err) => {
          console.error('登录失败：', err)
          that.checking = false
          uni.showToast({ title: '登录失败，请重试', icon: 'none' })
        })
      }
    },
    computed: {
      checkInput() {
        if (this.phone.length !== 11) {
          if (this.toast) {
            uni.showToast({ title: '请输入有效的手机号码', icon: 'none' })
          }
          return false
        } else if (this.password.length < 6) {
          if (this.toast) {
            uni.showToast({ title: '密码长度不得低于6位', icon: 'none' })
          }
          return false
        } else {
          return true
        }
      }
    }
  }
</script>

<style>
  page{
    background-color: #FFFFFF;
  }
  .signin-fn-text:active {
    color: #0081FF;
  }
</style>
