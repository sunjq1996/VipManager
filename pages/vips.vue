<template>
  <view>
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText"></block>
      <block slot="content">通讯录{{this.count?' [ '+this.count+' ]':''}}</block>
      <block slot="right">
        <view class="padding-lr text-gray na-fn-text">
          <navigator url="index" open-type="redirect">
            <text class="cuIcon-home"></text>
          </navigator>
        </view>
      </block>
    </cu-custom>
    <view class="padding-lr-sm bg-white">
      <view class="flex align-center bg-white solids-bottom">
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
    <view class="cu-list menu-avatar bg-white">
      <view class="cu-item" v-for="(item, index) in list" :key="index">
        <view class="cu-avatar lg bg-blue round light">{{item.v_name?item.v_name.charAt(0):'V'}}</view>
        <view class="content">
          <!-- 称呼 -->
          <view class="text-grey">
            <text class="text-hsm margin-right-xs" 
              :class="item.v_sex==='男'?'cuIcon-male':'cuIcon-female'">
            </text>
            <text class="text-hsm">{{item.v_name||''}}</text>
          </view>
          <view class="text-gray text-hsm flex justify-between">
            <view class="text-cut">
              <text class="cuIcon-mobilefill text-orange margin-right-xs"></text>
              <text>{{item.v_phone||''}}</text>
            </view>
            <view class="text-cut">
              <text class="cuIcon-moneybagfill text-red margin-right-xs text-price"></text>
              <text class="text-price">{{(item.v_sum||0).toFixed(2)}}</text>
            </view>
          </view>
        </view>
        <view class="action">
          <navigator :url="'search?phone=' + item.v_phone" open-type="navigate">
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
  import { count_, search_, delete_ } from '@/utils/index'
  export default {
    components: { naModalConfirm },
    data () {
      return {
        pageDiv: 10,
        pageIdx: 0,
        count: 0,
        list: []
      }
    },
    onPullDownRefresh() {
      this.getPageData(this.pageIdx)
      uni.stopPullDownRefresh()
    },
    onLoad(options) {
      var that = this
      // 统计记录总数
      count_('vip', [{ key: 'v_house_id', option: '==', value: this.$store.state.app.houseId }], res => {
        console.info(res)
        that.count = res
        if (res) {
          uni.showToast({ title: '共搜索到' + res + '条会员信息', icon: 'none' })
        } else {
          uni.showToast({ title: '会员信息为空', icon: 'none' })
        }
      }, err => {
        console.error(err)
        uni.showToast({ title: '会员信息搜索失败，请重试', icon: 'none' })
      })
    },
    mounted() {
      this.getPageData(0)
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
      // 获取分页信息
      getPageData(pageIdx) {
        console.log('getPageData is called, pageIdx: ', pageIdx)
        // 统计记录总数
        var that = this
        search_('vip', [{
          key: 'v_house_id', option: '==', value: this.$store.state.app.houseId
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
