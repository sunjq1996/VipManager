<template>
  <view>
    <!-- 标题栏 -->
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText"></block>
      <block slot="content">{{mode==='edit'?'客户编辑':'客户注册'}}</block>
      <block slot="right">
        <view class="padding-lr text-gray na-fn-text">
          <navigator url="index" open-type="redirect">
            <text class="cuIcon-home"></text>
          </navigator>
        </view>
      </block>
    </cu-custom>

    <!-- 注册表单 -->
    <view class="padding-lr-sm margin-tb-sm bg-white">
      <form>
        <!-- 顾客姓名 -->
        <view class="cu-form-group">
          <view class="title">顾客姓名</view>
          <input v-model="name" type="text" placeholder="..." name="input"></input>
        </view>
        <!-- 联系电话 -->
        <view class="cu-form-group">
          <view class="title">联系电话</view>
          <input v-model="phone" maxlength="11" type="number" placeholder="..." name="input"></input>
          <view class="cu-capsule radius">
            <view class='cu-tag bg-blue '>+86</view>
            <view class="cu-tag line-blue">中国大陆</view>
          </view>
        </view>
        <!-- 性别 -->
        <view class="cu-form-group">
          <view class="title">性别</view>
          <picker @change="onSexChange" :value="sexIdx" :range="sexPicker">
            <view class="picker">{{sexPicker[sexIdx]}}</view>
          </picker>
        </view>
        <!-- 生日 -->
        <view class="cu-form-group">
          <view class="title">生日</view>
          <picker mode="date" :value="birthday" start="1900-01-01" end="2021-01-01" @change="onBirthdayChange">
            <view class="picker">{{birthday}}</view>
          </picker>
        </view>
      </form>
    </view>
    <view class="padding-lr-sm margin-tb-sm bg-white">
      <form>
        <!-- 住址 -->
        <view class="cu-form-group margin-top-sm">
          <view class="title">家庭住址</view>
          <input v-model="addr" placeholder="..." name="input"></input>
        </view>
        <!-- QQ/微信号 -->
        <view class="cu-form-group">
          <view class="title">QQ(微信)号</view>
          <input v-model="qqWxId" placeholder="..." name="input"></input>
        </view>
      </form>
    </view>
    <view class="padding-lr-sm margin-tb-sm bg-white">
        <form>
        <!-- 卡类型 -->
        <view class="cu-form-group">
          <view class="title">类型</view>
          <picker @change="onTypeChange" :value="typeIdx" :range="typePicker">
            <view class="picker">{{typePicker[typeIdx]}}</view>
          </picker>
        </view>
        <!-- 卡上金额 -->
        <view class="cu-form-group margin-top-sm">
          <view class="title">卡金</view>
          <input v-model="sum" type="digit" name="input"></input>
        </view>
        <!-- 储值折扣 -->
        <view class="cu-form-group">
          <view class="title">储值折扣</view>
          <input v-model="rebate" type="digit" name="input"></input>
        </view>
        <!-- 储值卡号 -->
        <view class="cu-form-group margin-top-sm">
          <view class="title">储值卡号</view>
          <input v-model="cardId" type="text" disabled placeholder="---" name="input"></input>
        </view>
        <!-- 用户备注 -->
        <view class="cu-form-group align-start">
          <view class="title">备注</view>
          <textarea v-model="remark" maxlength="50" placeholder="..."></textarea>
        </view>
      </form>
    </view>
    <view class="flex flex-direction margin-top-sm padding-lr-sm">
      <button @tap="onSubmmitBtnClick" class="cu-btn bg-blue margin-tb-sm lg">提交</button>
    </view>
    <na-modal-toast ref="modalRegisterResult"></na-modal-toast>
  </view>
</template>

<script>
  import { insert_, search_, get_, update_ } from '@/utils/index.js'
  import naModalToast from '@/components/na-modal-toast/na-modal-toast.vue'
  export default {
    components: { naModalToast },
    data () {
      return {
        mode: '',
        uploading: false,

        sexPicker: ['男', '女'],
        sexIdx: 0,

        typePicker: ['大众会员', '白银会员', '黄金会员', '铂金会员', '钻石会员'],
        typeIdx: 0,

        cardId: '',
        name: '',
        phone: '',
        birthday: '2000-01-01',
        sum: 0,
        rebate: 1,
        addr: '',
        qqWxId: '',
        remark: '无'
      }
    },

    onLoad(options) {
      if (options.id) {
        this.mode = 'edit'
        var that = this
        get_('vip', options.id, res => {
          console.info(res)
          that.cardId = res.objectId
          that.name = res.v_name
          that.phone = res.v_phone
          that.qqWxId = res.v_qq_wx_id
          that.addr = res.v_addr
          that.birthday = res.v_birthday.iso.split(' ')[0]
          that.sum = res.v_sum
          that.rebate = res.v_rebate
          that.remark = res.v_remark
          that.sexIdx = that.sexPicker.indexOf(res.v_sex)
          that.typeIdx = that.typePicker.indexOf(res.v_type)
        }, err => {
          console.error(err)
          uni.showToast({ title: '客户信息获取失败，请重试', icon: 'none' })
        })
      } else {
        this.mode = 'register'
      }
    },

    methods: {
      checkVipInfo() {
        if (!this.name) {
          uni.showToast({ title: '客户姓名不能为空！', icon: 'none' })
          return false
        } else if (!this.phone) {
          uni.showToast({ title: '客户联系方式不能为空！', icon: 'none' })
          return false
        } else if (parseFloat(this.sum)<0) {
          uni.showToast({ title: '卡内余额不能为负！', icon: 'none' })
          return false
        } else if (parseFloat(this.rebate)<0.00) {
          uni.showToast({ title: '储值折扣不能小于0！', icon: 'none' })
          return false
        } else if (parseFloat(this.rebate)>1.00) {
          uni.showToast({ title: '储值折扣不能大于1！', icon: 'none' })
          return false
        } else if (this.phone.length !== 11) {
          uni.showToast({ title: '请输入正确的手机号码！', icon: 'none' })
          return false
        } else {
          return true
        }
      },
      // 修改生日
      onBirthdayChange(event) {
        console.log('onBirthdayChange is called, event = ', event)
        this.birthday = event.detail.value
      },

      // 修改性别
      onSexChange(event) {
        console.log('onSexChange is called, event = ', event)
        this.sexIdx = event.detail.value
      },

      // 修改卡类型
      onTypeChange(event) {
        console.log('onTypeChange is called, event = ', event)
        this.typeIdx = event.detail.value
      },

      // 提交
      onSubmmitBtnClick() {
        console.log('onSubmmitBtnClick is called')
        if (!this.checkVipInfo()) { return }
        if (this.uploading) {
          uni.showToast({ title: '正在上传...', icon: 'none' })
          return
        }
        this.uploading = true

        // 构造数据
        const data = {
          v_house_id: this.$store.state.app.houseId,
          v_name: this.name,
          v_phone: this.phone,
          v_qq_wx_id: this.qqWxId||'未填写',
          v_sex: this.sexPicker[this.sexIdx],
          v_birthday: {
            '__type': 'Date',
            'iso': `${this.birthday}${' '}${'00:00:00'}`,
          },
          v_addr: this.addr||'未填写',
          v_remark: this.remark||'无',
          v_type: this.typePicker[this.typeIdx],
          v_sum: parseFloat(this.sum),
          v_rebate: parseFloat(this.rebate)
        }

        if (this.mode === 'register') {
          this.checkPhoneExist(data, () => {}, this.insertVipInfo)
        } else {
          var that = this
          update_('vip', this.cardId, data, res => {
            console.info(res)
            that.uploading = false
            uni.showToast({ title: '客户信息编辑成功', icon: 'none' })
          }, err => {
            console.error(err)
            that.uploading = false
            uni.showToast({ title: '客户信息编辑失败，请重试', icon: 'none' })
          })
        }
      },

      // 校验用户手机号是否已存在
      checkPhoneExist(data, existCallback, notExistCallback) {
        var houseId = this.$store.state.app.houseId
        var that = this
        // 回调函数
        let callback = {
          exist: existCallback || function(){},
          notExist: notExistCallback || function(){}
        }

        // 查询用户是否已存在
        search_('vip', [{
          key: 'v_house_id', option: '==', value: houseId
        }, {
          key: 'v_phone', option: '==', value: this.phone
        }], 0, 200, res => {
          if (res.length) {
            that.uploading = false
            uni.showToast({ title: '手机号码已注册！', icon: 'none' })
            callback.exist() // 手机号已存在回调函数
          } else {
            callback.notExist(data) // 若手机号不存在回调函数
          }
        }, err => {
          console.error('查询失败：', err)
          that.uploading = false
          uni.showToast({ title: '查询失败，请重试', icon: 'none' })
        })
      },

      // 插入用户vip信息
      insertVipInfo(data) {
        insert_('vip', data, (res) => {
          this.uploading = false
          console.info(res)
          // uni.showToast({ title: '注册成功', icon: 'none' })
          var that = this
          this.$refs.modalRegisterResult.showModal({
            title: '注册结果',
            content: [{
              label: '客户姓名',
              content: this.name
            }, {
              label: '联系方式',
              content: this.phone
            },{
              label: '会员卡号',
              content: res.objectId
            }],
            callback: () => {
              uni.redirectTo({ url: './index' })
            }
          })
          // uni.navigateBack({ delta: 1 })
        }, (err) => {
          this.uploading = false
          console.error(err)
          uni.showToast({ title: '注册失败，请重试', icon: 'none' })
        })
      }
    }
  }
</script>

<style>
</style>
