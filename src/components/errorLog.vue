<template>
  <xm-dialog :visible="visible" title="未上报的错误日志" @close="$emit('update:visible', false)">
    <!-- <el-button type="primary" @click="() => {console.log(abc)}" v-if="true">生成</el-button> -->
    
    <div class="action-bar">
      <el-button :icon="Upload" @click="handleReport">上报</el-button>
      <el-button type="danger" :icon="Delete" @click="handleClear">清空</el-button>
      <el-button v-if="!isMute" type="warning" :icon="MuteNotification" @click="handleMute">静默捕获异常</el-button>
      <el-button v-else type="success" :icon="Bell" @click="handleDisableMute">启用异常提示</el-button>
    </div>

    <template v-if="logs.length">
      <el-timeline>
        <el-timeline-item
          v-for="logItem in logs"
          :timestamp="logItem.time"
          class="error-log-item"
          placement="top"
        >
          <el-card>
            <h3 class="message">{{logItem.message}}</h3>
            <p class="stack">{{logItem.stack}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </template>
    <template v-else>
      <el-empty description="没有错误日志" />
    </template>
  </xm-dialog>
</template>


<script setup>
import { Upload, Delete, MuteNotification, Bell } from '@element-plus/icons-vue'
</script>
<script>
import { ElMessage } from 'element-plus'
import XmDialog from "./dialog.vue"
export default {
  components: {
    XmDialog
  },
  emits: ['update:visible'],
  props: ['visible'],
  data() {
    return {
      logs: [],
      isMute: false
    }
  },
  watch: {
    visible(){
      this.getErrorLogs()
    }
  },
  methods: {
    // 获取错误缓存列表
    getErrorLogs(){
      this.logs = JSON.parse(localStorage.getItem("errorNotReport")) || []
    },
    // 错误上报
    handleReport(){
      ElMessage({
        showClose: true,
        message: '开发中',
        type: 'warning',
      })
    },
    // 清空错误日志
    handleClear(){
      localStorage.setItem("errorNotReport", JSON.stringify([]))
      this.logs = []
      ElMessage({
        showClose: true,
        message: '日志已清空',
        type: 'success',
      })
    },
    // 静默异常捕获，不提示
    handleMute(){
      this.isMute = true
      localStorage.setItem("isMuteErrorCatch", true)
      ElMessage({
        showClose: true,
        message: '已启用静默',
        type: 'warning',
      })
    },
    // 启用异常捕获提示
    handleDisableMute(){
      this.isMute = false
      localStorage.setItem("isMuteErrorCatch", false)
      ElMessage({
        showClose: true,
        message: '已关闭静默',
        type: 'success',
      })
    },
  }
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
}
.action-bar{
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}
.error-log-item {

  .message {
    margin: 0;
    color: #c45656;
  }
  .stack {
    white-space: pre-wrap;
  }
}
</style>