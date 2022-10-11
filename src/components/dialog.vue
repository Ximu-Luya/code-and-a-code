<template>
  <el-dialog
    v-model="visible"
    @close="handleClose"
    @open="handleOpen"
    class="dialog animate__animated"
    :class="{ 'animate__zoomOut': disappearing, 'animate__zoomIn': !disappearing}"
    :width="width || '70%'"
    :style="{height: height || '600px'}"
    center
    :title="title"
  >
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible', 'title', 'width', 'height'],
  data() {
    return {
      disappearing: false
    }
  },
  emits: ['close'],
  methods: {
    handleClose() {
      this.$emit('close')
      this.disappearing = true
    },
    handleOpen() {
      // 打开弹窗时取消消失动画以防止弹窗打开后马上关闭
      this.disappearing = false
    }
  },
}
</script>

<style lang="scss">
// 弹窗动画持续时间修改为0.3秒
.animate__animated {
  &.animate__zoomIn, &.animate__zoomOut {
    --animate-duration: 0.3s;
  }
}
.dialog {
  max-height: 70%;
  height: 600px;
  min-width: 350px;
}
.el-dialog__body {
  position: absolute;
  top: 54px; bottom: 0;
  width: 100%;
  padding-top: 0;
  overflow: auto;
}
// 使element-plus对话框相对页面元素而非body
.el-overlay {
  position: absolute !important;
  .el-overlay-dialog {
    position: absolute !important;
  }
}
</style>