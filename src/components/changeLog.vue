<template>
  <el-dialog
    v-model="visible"
    @close="handleClose"
    @open="handleOpen"
    class="dialog animate__animated animate__zoomIn"
    :class="{ 'animate__zoomOut': disappearing}"
    width="70%"
    center
    title="更新日志"
  >
    <article class="markdown-body">
      <div
        v-for="logItem in logs"
        :key="logItem.date"
        class="change-log-item"
      >
        <h2>{{ logItem.version }} ({{ logItem.update }})</h2>
        <template v-for="changeItem in logItem.changes">
          <h3>{{changeItem.type}}</h3>
          <ul>
            <li v-for="contentItem in changeItem.content">
              <strong>{{contentItem.title}}: </strong>
              {{contentItem.description}}
            </li>
          </ul>
        </template>
      </div>
    </article>
  </el-dialog>
</template>

<script>
import ChangeLogData from '@/assets/changelog.json'
export default {
  props: ['visible'],
  data() {
    return {
      logs: ChangeLogData,
      disappearing: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.disappearing = true
    },
    handleOpen() {
      // 打开弹窗时取消消失动画以防止弹窗打开后马上关闭
      this.disappearing = false
    }
  },
}
</script>

<style lang="scss" scoped>
.markdown-body {
  h2 {
    margin-top: 0 !important;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    padding-bottom: 0.3em;
    font-size: 1.5em;
    border-bottom: 1px solid hsla(210,18%,87%,1);;
  }

  h3 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    font-size: 1.25em;
  }
}
</style>
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