<template>
  <view class="cu-modal" :class="option.show?'show':''">
    <view class="cu-dialog">
      <view class="cu-bar bg-white justify-end">
        <view class="content"> {{ option.title }} </view>
        <view class="action" @tap="closeModal">
          <text class="cuIcon-close text-red"></text>
        </view>
      </view>
      <view class="padding-xl text-cut">
        <view class="cu-list menu">
          <view class="cu-item" v-for="(item,index) in option.content" :key="index">
            <view class="content flex justify-between">
              <text>{{item.label}}：</text>
              <text>{{item.content}}</text>
            </view>
          </view>
          <view class="cu-item margin-top-xs" v-show="closeIdx>0">
            <view class="content">
              <text class="text-red">{{option.warnMsg}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'na-modal-toast',
    data() {
      return {
        closeIdx: 0,
        option: {
          title: '', // 标题
          content: [], // 内容
          warnMsg: '',
          show: false, // 是否可见
          callback: null
        }
      }
    },

    methods: {
      // 显示模态框
      showModal(option) {
        console.debug('ShowModal is called, option = ', option)
        this.option.title = option.title || '标题'
        this.option.content = option.content || [{ label: '标签1', content: '内容1' }, { label: '标签2', content: '内容2' }]
        this.option.warnMsg = option.warnMsg || '请确认您已阅读完毕所有提示信息！'
        this.option.callback = option.callback || function(){}
        this.option.show = true
      },

      // 关闭模态框
      closeModal() {
        if (this.closeIdx > 0) {
          this.closeIdx = 0
          this.option.show = false
          this.option.callback()
        } else {
          this.closeIdx = this.closeIdx + 1
        }
      }
    }
  }
</script>

<style>
</style>
