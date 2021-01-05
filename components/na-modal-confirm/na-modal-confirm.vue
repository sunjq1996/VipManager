<template>
  <view class="cu-modal" :class="option.show?'show':''" @tap="closeModal">
    <view class="cu-dialog" @tap.stop="()=>{}">
      <view class="cu-bar bg-white justify-end">
        <view class="content"> {{ option.title }} </view>
        <view class="action" @tap="closeModal">
          <text class="cuIcon-close text-red"></text>
        </view>
      </view>
      <view class="cu-bar bg-white">
        <view  :class="'text-' + option.cancelColor"
          class="action margin-0 flex-sub"
          @tap="callback('CANCEL', $event)"> {{ option.cancelText }} </view>
        <view :class="'text-' + option.confirmColor"
          class="action margin-0 flex-sub solid-left"
          @tap="callback('CONFIRM', $event)"> {{ option.confirmText }} </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'na-modal-confirm',
    data() {
      return {
        option: {
          title: '', // 标题
          cancelText: '', // 取消文字
          confirmText: '', // 确认文字
          cancelColor: '', // 取消文字的颜色
          confirmColor: '', // 确认文字的颜色
          cancelCallback: null, // 取消回调函数
          confirmCallback: null, // 确认回调函数
          show: false, // 是否可见
        }
      }
    },

    methods: {
      // 显示模态框
      showModal(option) {
        console.debug('ShowModal is called, option = ', option)
        this.option.title = option.title || '标题'
        this.option.cancelText = option.cancelText || '取消'
        this.option.confirmText = option.confirmText || '确定'
        this.option.cancelColor = option.cancelColor || 'gray'
        this.option.confirmColor = option.confirmColor || 'green'
        this.option.cancelCallback = option.cancelCallback || function() {}
        this.option.confirmCallback =  option.confirmCallback || function() {}
        this.option.show = true
      },

      // 关闭模态框
      closeModal() {
        this.option.show = false
      },

      // 回调函数
      callback (type, event) {
        console.log('Callback is called, type = ', type)
        if (type === 'CANCEL') {
          this.option.cancelCallback(event)
        }
        if (type === 'CONFIRM') {
          this.option.confirmCallback(event)
        }
        this.option.show = false
      }
    }
  }
</script>

<style>
</style>
