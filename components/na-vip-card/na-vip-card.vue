<template>
  <view class="cu-item">
    <view class="cuIcon-cu-image bg-white">
      <view class="cuIcon-myfill text-red"></view>
    </view>
    <view class="content">
      <!-- 称呼 -->
      <view class="text-grey">
        <text class="margin-right-xs" :class="v_sex==='男'?'cuIcon-male':'cuIcon-female'"></text>
        <text>{{v_name||''}}</text>
      </view>
      <view class="text-gray text-sm flex justify-between">
        <view class="text-cut">
          <text class="cuIcon-addressbook margin-right-xs"></text>
          <text>{{v_phone||''}}</text>
        </view>
        <view class="text-cut">
          <text class="cuIcon-vipcard margin-right-xs"></text>
          <text>{{objectId||''}}</text>
        </view>
      </view>
      <view class="text-gray text-sm flex justify-between">
        <view class="text-cut">
          <text class="cuIcon-apps margin-right-xs"></text>
          <text>{{v_type||''}}</text>
        </view>
        <view class="text-cut">
          <text class="cuIcon-moneybag margin-right-xs"></text>
          <text class="text-price">{{v_sum||0}}</text>
        </view>
        <view class="text-cut">
          <text class="cuIcon-friendfavor margin-right-xs"></text>
          <text>{{v_rebate||1}}</text>
        </view>
      </view>
      <view class="text-gray text-sm flex justify-between">
        <view class="text-cut">
          <text class="cuIcon-crown margin-right-xs"></text>
          <text>{{v_birthday?v_birthday.iso.split(' ')[0]:''}}</text>
        </view>
        <view class="text-cut">
          <text class="cuIcon-mobilefill margin-right-xs"></text>
          <text>{{v_qq_wx_id||'未填写'}}</text>
        </view>
      </view>
      <view class="text-gray text-sm flex justify-between">
        <view class="text-cut">
          <text class="cuIcon-location margin-right-xs"></text>
          <text>{{v_addr||'未填写'}}</text>
        </view>
        <view class="text-cut">
          <text class="cuIcon-text margin-right-xs"></text>
          <text>{{v_remark||'无'}}</text>
        </view>
      </view>
    </view>
    <view class="action">
      <view class="text-grey text-xs">{{createdAt.slice(5,10)}}</view>
      <view class="text-grey text-xs">{{createdAt.slice(11,16)}}</view>
      <view @tap="onDeleteIconClick" :data-id="objectId"
        class="cuIcon-deletefill text-grey na-fn-text"></view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'na-vip-list-item',
    props: {
      objectId: '', // 对象ID（卡号）

      v_name: '',
      v_phone: '',
      v_sex: '',
      v_birthday: '',
      v_qq_wx_id: '',
      v_addr: '',

      v_type: '',
      v_sum: '',
      v_rebate: '',
      v_remark: '',
      createdAt: '',
      updatedAt: ''
    }
  }
</script>

<style>
</style>
