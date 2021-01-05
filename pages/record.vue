<template>
  <view>
    <!-- 标题栏 -->
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText"></block>
      <block slot="content">消费记录{{this.count?' [ '+this.count+' ]':''}}</block>
      <block slot="right">
        <view class="padding-lr text-gray na-fn-text">
          <navigator url="index" open-type="redirect">
            <text class="cuIcon-home"></text>
          </navigator>
        </view>
      </block>
    </cu-custom>
    <view class="padding-lr-sm bg-white">
      <view class="flex align-center solids-bottom">
        <view class="flex-sub text-center">
          <view class="padding-sm flex justify-between">
            <text @tap="onPagePrevClick" class="shadow">
              <!-- <text class="cuIcon-pullleft"></text> -->
              <text class="margin-left-xs text-hsm cu-tag radius na-fn-text">上一页</text>
            </text>
            <text class="text-lg shadow">{{getPageNum>0?pageIdx+1:pageIdx}}/{{getPageNum}}</text>
            <text @tap="onPageNextClick" class="shadow">
              <text class="margin-left-xs text-hsm cu-tag radius na-fn-text">下一页</text>
              <!-- <text class="cuIcon-pullright"></text> -->
            </text>
          </view>
        </view>
      </view>
    </view>
    <view class="cu-list menu-avatar">
      <view class="cu-item" v-for="(item, index) in list" :key="index">
        <view class="cu-avatar lg bg-blue light round">{{item.b_vip_name?item.b_vip_name.charAt(0):'V'}}</view>
        <view class="content">
          <!-- 称呼 -->
          <view class="text-grey">
            <text class="text-hsm">{{item.b_vip_name||''}}</text>
          </view>
          <view class="text-gray text-sm flex justify-between">
            <view class="text-cut">
              <text class="cuIcon-mobilefill text-orange margin-right-xs"></text>
              <text class="text-grey">{{item.b_vip_phone||''}}</text>
            </view>
            <view class="text-cut">
              <text class="cuIcon-moneybagfill text-red margin-right-xs text-price"></text>
              <text class="text-grey">{{item.b_type==='充值'?'+':'-'}}</text>
              <text class="text-grey">{{((item.b_type==='充值'?item.b_pay:item.b_pay_rebated)||0).toFixed(2)}}</text>
            </view>
          </view>
          <view class="text-gray text-sm flex justify-between">
            <view class="text-cut">
              <text class="cuIcon-calendar text-bold text-cyan margin-right-xs"></text>
              <text class="text-grey">{{item.createdAt.slice(5, 16)||''}}</text>
            </view>
            <view class="text-cut">
              <text class="cuIcon-apps text-bold text-olive margin-right-xs"></text>
              <text class="text-grey">{{item.b_item||'无'}}</text>
            </view>
          </view>
        </view>
        <view class="action">
          <navigator :url="'billsearch?billId=' + item.objectId" open-type="navigate">
            <view class="text-grey cuIcon-right"></view>
          </navigator>
        </view>
      </view>
    </view>
    <na-modal-confirm ref="modalDeleteConfirm"></na-modal-confirm>
  </view>
</template>

<script>
  import naModalConfirm from '@/components/na-modal-confirm/na-modal-confirm.vue'
  import { get_, count_, search_, update_ } from '@/utils/index'
  export default {
  components: { naModalConfirm },
    data() {
      return {
        deleteing: false,
        vipInfo: {},

        list: [], // 当前页的记录

        count: 0,
        pageIdx: 0, // 当前分页
        pageDiv: 5, // 每页显示的数量
      }
    },
    onPullDownRefresh() {
      this.getPageData(this.pageIdx)
      uni.stopPullDownRefresh()
    },
    onLoad(options) {
      if (options.id) {
        var that = this
        // 获取用户信息
        get_('vip', options.id, res => {
          console.info(res)
          that.vipInfo = res
          that.getPageData(0)
        }, err => {
          console.error(err)
          uni.showToast({ title: '客户信息获取失败，请重试', icon: 'none' })
        })
        // 统计记录总数
        count_('bill', [{
          key: 'b_vip_id',
          option: '==',
          value: options.id
        }, {
          key: 'b_visible',
          option: '==',
          value: true
        }], res => {
          console.info(res)
          that.count = res
          if (res) {
            uni.showToast({ title: '共搜索到' + res + '条消费记录', icon: 'none' })
          } else {
            uni.showToast({ title: '消费记录为空', icon: 'none' })
          }
        }, err => {
          console.error(err)
          uni.showToast({ title: '消费记录搜索失败，请重试', icon: 'none' })
        })
      }
    },
    methods: {
      // 上一页
      onPagePrevClick() {
        if (this.pageIdx > 0) {
          this.getPageData(this.pageIdx - 1)
        } else {
          uni.showToast({ title: '当前为第一页', icon: 'none' })
        }
      },
      // 下一页
      onPageNextClick () {
        if (this.pageIdx < this.getPageNum - 1) {
          this.getPageData(this.pageIdx + 1)
        } else {
          uni.showToast({ title: '当前为最后一页', icon: 'none' })
        }
      },
      // 删除
      onDeleteIconClick(event) {
        console.log('onDeleteIconClick is called')

        if (this.deleteing) {
          uni.showToast({ title: '正在删除...', icon: 'none' })
          return
        }
        var that = this
        var billId = event.currentTarget.dataset.id||''
        this.$refs.modalDeleteConfirm.showModal({
          title: '确认删除账单信息？',
          confirmCallback: () => {
            that.deleteing = true
            update_('bill', billId, { b_visible: false }, res => {
              console.info(res)
              that.deleteing = false
              uni.showToast({ title: '账单信息删除成功', icon: 'none' })
              that.count = that.count - 1
              that.getPageData(0)
            }, err => {
              console.error(err)
              that.deleteing = false
              uni.showToast({ title: '账单信息删除失败，请重试', icon: 'none' })
            })
          }
        })
      },
      // 获取分页信息
      getPageData(pageIdx) {
        console.log('getPageData is called, pageIdx: ', pageIdx)
        // 统计记录总数
        var that = this
        search_('bill', [{
          key: 'b_vip_id',
          option: '==',
          value: this.vipInfo.objectId||''
        }, {
          key: 'b_visible',
          option: '==',
          value: true
        }], this.pageDiv*(pageIdx||0), this.pageDiv, res => {
          console.info(res)
          that.list = res
          that.pageIdx = pageIdx
        }, err => {
          console.error(err)
          uni.showToast({ title: '消费记录搜索失败，请重试', icon: 'none' })
        })
      }
    },
    computed: {
      getPageNum() {
        return Math.ceil(this.count/this.pageDiv)
      }
    }
  }
</script>

<style>
  page {
    background-color: #FFFFFF;
  }
</style>
