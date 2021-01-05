<template>
  <view>
    <!-- 标题栏 -->
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText"></block>
      <block slot="content">账单查询</block>
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
        <input @confirm="onSearchBtnClick" v-model="billId" :adjust-position="false" type="text"
          placeholder="输入账单编号搜索" confirm-type="search"></input>
      </view>
      <view class="action">
        <button @tap="onSearchBtnClick" class="cu-btn bg-blue shadow-blur round">搜索</button>
      </view>
    </view>
    <view class="padding-lr-sm margin-top-sm bg-white">
      <view class="cu-list menu" v-if="found&&resIdx===0">
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-myfill text-red"></text>
            <text class="text-grey">客户姓名</text>
          </view>
          <view class="action flex justify-end align-end">
            <view class="margin-right-xs">
              <text>{{billInfo.b_vip_name||''}}</text>
            </view>
            <view>
              <navigator :url="'search?phone=' + billInfo.b_vip_phone" class="text-grey">
                <text class="cuIcon-right"></text>
              </navigator>
            </view>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-mobilefill text-olive"></text>
            <text class="text-grey">联系方式</text>
          </view>
          <view class="action">
            <text>{{billInfo.b_vip_phone||''}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-vipcard text-orange"></text>
            <text class="text-grey">会员卡号</text>
          </view>
          <view class="action">
            <text>{{billInfo.b_vip_id||''}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-calendar text-yellow"></text>
            <text class="text-grey">消费日期</text>
          </view>
          <view class="action">
            <text>{{billInfo.b_date?billInfo.b_date.iso.split(' ')[0]:''}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-calendar text-blue"></text>
            <text class="text-grey">创建日期</text>
          </view>
          <view class="action">
            <text>{{billInfo.createdAt||''}}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="padding-lr-sm margin-top-sm bg-white">
      <view class="cu-list menu" v-if="found&&resIdx===0">
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-read text-cyan"></text>
            <text class="text-grey">账单编号</text>
          </view>
          <view class="action">
            <text>{{billInfo.objectId||''}}</text>
            <text @tap='onBillIdCopyIconClick' class="cuIcon-copy margin-left-xs text-grey"></text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="text-pink" :class="billInfo.v_sex==='消费'?'cuIcon-pay':'cuIcon-recharge'"></text>
            <text class="text-grey">消费类型</text>
          </view>
          <view class="action">
            <text>{{billInfo.b_type||''}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-apps text-brown"></text>
            <text class="text-grey">{{billInfo.b_type||'消费'}}项目</text>
          </view>
          <view class="action">
            <text>{{billInfo.b_item||''}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-moneybagfill text-orange"></text>
            <text class="text-grey">{{billInfo.b_type||'消费'}}金额</text>
          </view>
          <view class="action">
            <text>{{billInfo.b_type==='消费'?'- ':'+ '}}</text>
            <text>{{(billInfo.b_pay||0).toFixed(2)}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item" v-show="billInfo.b_type==='消费'">
          <view class="content">
            <text class="cuIcon-friendfavor text-pink"></text>
            <text class="text-grey">消费折扣</text>
          </view>
          <view class="action">
            <text>x {{(billInfo.b_rebate||0).toFixed(2)}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item" v-show="billInfo.b_type==='消费'">
          <view class="content">
            <text class="cuIcon-moneybagfill text-pink"></text>
            <text class="text-grey">折后金额</text>
          </view>
          <view class="action">
            <text>- {{(billInfo.b_pay_rebated||0).toFixed(2)}}</text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-moneybagfill text-red"></text>
            <text class="text-grey">卡上余额</text>
          </view>
          <view class="action">
            <text class="margin-right-xs">{{(billInfo.b_remaining||0).toFixed(2)}}</text>
            <text>({{(billInfo.b_sum||0).toFixed(2)}}{{billInfo.b_type==='消费'?` - ${(billInfo.b_pay_rebated||0).toFixed(2)}`:` + ${(billInfo.b_pay||0).toFixed(2)}`}})</text>
          </view>
        </view>
        <view class="cu-item na-list-item">
          <view class="content">
            <text class="cuIcon-text text-green"></text>
            <text class="text-grey">备注</text>
          </view>
          <view class="action">
            <text>{{billInfo.b_remark||'无'}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-bar bg-white tabbar foot box-shadow" v-show="found">
      <view class="action na-fn-text" @tap="onTextDeleteClick">
        <view class='cuIcon-cu-image'>
          <view class="cuIcon-deletefill text-red"></view>
        </view>
        <view class="text-bold">删除</view>
      </view>
    </view>
    <na-modal-confirm ref="modalDeleteConfirm"></na-modal-confirm>
  </view>
</template>

<script>
  import { get_, delete_ } from '@/utils/index.js'
  import naModalConfirm from '@/components/na-modal-confirm/na-modal-confirm.vue'
  export default {
  components: { naModalConfirm },
    data() {
      return {
        searching: false,
        found: false,
        billId: '',
        billInfo: {},
        resIdx: 0,
        resPicker: ['客户', '会员卡']
      }
    },
    onLoad(options) {
      if (options.billId) {
        this.billId = options.billId
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
        if (!this.billId) {
          uni.showToast({ title: '账单编号不能为空！', icon: 'none' })
          return false
        } else {
          return true
        }
      },
      // 复制账单编号
      onBillIdCopyIconClick() {
        // #ifdef H5
        uni.showToast({ title: 'H5暂不支持剪切板功能', icon: 'none' })
        return
        // #endif
        uni.setClipboardData({
          data: this.billId,
          success() {
            uni.showToast({ title: '账单编号已复制到剪切板', icon: 'none' })
          },
          fail() {
            uni.showToast({ title: '账单编号复制失败！', icon: 'none' })
          }
        })
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
        get_('bill', this.billId,res => {
          console.info(res)
          that.searching = false
          that.billInfo = res
          that.found = true
        }, err => {
          console.error(err)
          uni.showToast({ title: '账单查询失败，请重试', icon: 'none' })
          that.searching = false
        })
      },

      // 删除用户
      onTextDeleteClick() {
        var that = this
        this.$refs.modalDeleteConfirm.showModal({
          title: '确认删除账单信息？',
          confirmCallback: () => {
            delete_('bill', that.billInfo.objectId, res => {
              console.info(res)
              uni.showToast({ title: '账单信息删除成功', icon: 'none' })
              that.found = false
            }, err => {
              console.error(err)
              uni.showToast({ title: '账单信息删除失败，请重试', icon: 'none' })
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
