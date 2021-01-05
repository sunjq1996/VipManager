<template>
  <view>
    <!-- 标题栏 -->
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText"></block>
      <block slot="content">创建账单</block>
      <block slot="right">
        <view class="padding-lr text-gray na-fn-text">
          <navigator url="index" open-type="redirect">
            <text class="cuIcon-home"></text>
          </navigator>
        </view>
      </block>
    </cu-custom>
    <view class="padding-lr-sm margin-top-sm bg-white">
      <form>
        <!-- 姓名 -->
        <view class="cu-form-group">
          <view class="title">贵宾姓名</view>
          <input v-model="vipInfo.v_name||''" disabled type="text" name="input"></input>
        </view>
        <!-- 联系方式 -->
        <view class="cu-form-group">
          <view class="title">联系方式</view>
          <input v-model="vipInfo.v_phone||''" disabled type="text" name="input"></input>
        </view>
      </form>
    </view>
    <view class="padding-lr-sm margin-top-sm bg-white">
      <form>
        <!-- 会员卡号 -->
        <view class="cu-form-group margin-top-sm">
          <view class="title">会员卡号</view>
          <input v-model="vipInfo.objectId||''" disabled type="text" name="input"></input>
        </view>

        <!-- 卡上余额 -->
        <view class="cu-form-group">
          <view class="title">卡上余额</view>
          <input v-model="vipInfo.v_sum||0" disabled type="digit" name="input">{{billInfo.typeIdx===0?'-'+' '+getPayRebated:'+'+' '+getPay}}</input>
        </view>
        <!-- 会员类型 -->
        <view class="cu-form-group">
          <view class="title">会员类型</view>
          <input v-model="vipInfo.v_type||''" disabled type="text" name="input"></input>
        </view>
        <!-- 消费折扣 -->
        <view class="cu-form-group">
          <view class="title">消费折扣</view>
          <input v-model="vipInfo.v_rebate||1" disabled type="digit" name="input"></input>
        </view>
      </form>
    </view>
    <view class="padding-lr-sm margin-top-sm bg-white">
      <form>
        <!-- 消费项目 -->
        <view class="cu-form-group margin-top-sm">
          <view class="title">消费类型</view>
          <picker @change="onTypeChange" :value="billInfo.typeIdx" :range="billInfo.typePicker">
            <view class="picker">{{billInfo.typePicker[billInfo.typeIdx]}}</view>
          </picker>
        </view>
        <view class="cu-form-group">
          <view class="title">{{billInfo.typeIdx===0?'消费项目':'充值项目'}}</view>
          <input v-model="billInfo.item" type="text" placeholder="..." name="input"></input>
        </view>
        <!-- 消费金额 -->
        <view class="cu-form-group">
          <view class="title"> {{billInfo.typeIdx===0?'消费金额':'充值金额'}}</view>
          <input v-model="billInfo.pay" type="digit" name="input">{{billInfo.typeIdx===0?'x '+(vipInfo.v_rebate||1):''}}</input>
        </view>
        <!-- 消费日期 -->
        <view class="cu-form-group">
          <view class="title">消费日期</view>
            <picker mode="date" :value="billInfo.date" start="1900-01-01" :end="getTodayDate()"
              @change="onDateChange">
              <view class="picker">{{billInfo.date}}</view>
            </picker>
        </view>
      </form>
    </view>
    <view class="padding-lr-sm margin-top-sm bg-white">
      <form>
        <view class="cu-form-group margin-top-sm">
          <view class="title">备注</view>
          <input v-model="billInfo.remark" type="text" placeholder="..." name="input"></input>
        </view>
      </form>
    </view>
    <!-- 提交按钮 -->
    <view class="flex flex-direction margin-top-sm padding-lr-sm">
      <button @tap="onSubmmitBtnClick" class="cu-btn bg-blue margin-tb-sm lg">提交</button>
    </view>
    <na-modal-toast-confirm ref="modalBillCheck"></na-modal-toast-confirm>
  </view>
</template>

<script>
  import { get_, insert_, atom_, update_, formatDate } from '@/utils/index'
  import naModalToastConfirm from '@/components/na-modal-toast-cofirm/na-modal-toast-confirm.vue'
  export default {
    components: { naModalToastConfirm },
    data() {
      return {
        uploading: false,
        vipInfo: {},

        billInfo: {
          typeIdx: 0,
          typePicker: ['消费', '充值'],

          item: '', pay: '0',
          date: this.getTodayDate(),
          remark: '无'
        }
      }
    },
    onLoad(options) {
      if (options.id) {
        var that = this
        get_('vip', options.id, res => {
          console.info(res)
          that.vipInfo = res
        }, err => {
          console.error(err)
          uni.showToast({ title: '客户信息获取失败，请重试', icon: 'none' })
        })
      }
    },
    methods: {
      getTodayDate() {
        return formatDate(new Date())
      },
      onDateChange(event) {
        this.billInfo.date = event.detail.value
      },
      onTypeChange(event) {
        this.billInfo.typeIdx = parseInt(event.detail.value)
      },
      checkBill() {
        if (!this.billInfo.item) {
          uni.showToast({ title: '消费/充值项目不能为空！', icon: 'none' })
          return false
        } else if (!this.billInfo.pay) {
          uni.showToast({ title: '消费/充值金额不能为空！', icon: 'none' })
          return false
        } else if (!parseFloat(this.billInfo.pay)) {
          uni.showToast({ title: '消费/充值金额不能为0！', icon: 'none' })
          return false
        } else if (parseFloat(this.billInfo.pay) < 0) {
          uni.showToast({ title: '消费/充值金额不能为负！', icon: 'none' })
          return false
        } else {
          return true
        }
      },

      onSubmmitBtnClick () {
        if (this.uploading) {
          uni.showToast({title: '正在更新...', icon:'loading' })
          return
        }

        // 核对账单
        if (!this.checkBill()) {
          return
        }

        // 弹窗提示
        var that = this
        this.$refs.modalBillCheck.showModal({
          title: '账单确认',
          content:  this.billInfo.typeIdx===0 ? [{
            label: '消费金额',
            content: '-' + this.getPay
          }, {
            label: '消费折扣',
            content: this.vipInfo.v_rebate
          }, {
            label: '折后金额',
            content: '-' + this.getPayRebated
          }, {
            label: '卡上余额',
            content: `${this.getRemaining}${' '}${'('}${this.vipInfo.v_sum}${' - '}${this.getPayRebated}${')'}`
          }] : [{
            label: '充值金额',
            content: '+' + this.getPay
          }, {
            label: '卡上余额',
            content: `${this.getRemaining}${' '}${'('}${this.vipInfo.v_sum}${' + '}${this.getPay}${')'}`
          }],
          confirmCallback: () => {
            that.uploading = true
            insert_('bill', {
              b_house_id: that.$store.state.app.houseId,
              b_type: that.billInfo.typePicker[that.billInfo.typeIdx],
              b_item: that.billInfo.item,
              b_sum: that.vipInfo.v_sum||0,
              b_pay: that.getPay,
              b_rebate: that.vipInfo.v_rebate||1,
              b_vip_id: that.vipInfo.objectId||'',
              b_vip_name: that.vipInfo.v_name||'',
              b_vip_phone: that.vipInfo.v_phone||'',
              b_pay_rebated: that.getPayRebated,
              b_remaining: that.getRemaining,
              b_remark: that.billInfo.remark||'无',
              b_date: {
                __type: 'Date',
                iso: `${that.billInfo.date}${' '}${'00:00:00'}`
              }
            }, res => {
              console.info(res)
              uni.showToast({ title: '账单上传成功', icon: 'none' })
              atom_('vip', that.vipInfo.objectId, 'v_sum', 
                that.billInfo.typeIdx===0?-1*that.getPayRebated:that.getPay, res => {
                console.info('atom_: ', res)
                that.uploading = false
                uni.showToast({ title: '客户余额更新成功', icon: 'none' })
              }, err => {
                console.error(err)
                that.uploading = false
                uni.showToast({ title: '客户余额更新失败，请手动更新', icon: 'none' })
              })
              uni.navigateBack({ delta: 1 })
            }, err => {
              console.error(err)
              that.uploading = false
              uni.showToast({ title: '账单上传失败，请重试', icon: 'none' })
            })
          }
        })
      }
    },
    computed: {
      getPay() {
        return parseFloat(parseFloat(this.billInfo.pay||0).toFixed(2))
      },
      getPayRebated() {
        return parseFloat((parseFloat(this.billInfo.pay||0) * parseFloat(this.vipInfo.v_rebate||1)).toFixed(2))
      },
      getRemaining() {
        if (this.billInfo.typeIdx === 0) {
          return parseFloat((this.vipInfo.v_sum - this.getPayRebated).toFixed(2))
        } else {
          return parseFloat((this.vipInfo.v_sum + this.getPay).toFixed(2))
        }
      }
    }
  }
</script>

<style>
</style>
