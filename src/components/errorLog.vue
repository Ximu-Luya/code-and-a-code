<template>
  <Dialog v-model:visible="visible" title="未上报的错误日志">
    <div class="flex justify-center gap-2 mb-4">
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        @click="handleReport"
      >
        <div class="i-icon-park-outline-upload mr-1"></div>上报
      </button>
      <button 
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
        @click="handleClear"
      >
        <div class="i-icon-park-outline-delete-five mr-1"></div>清空
      </button>
      <button 
        v-if="!isMute" 
        class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center"
        @click="handleMute"
      >
        <div class="i-icon-park-outline-close-remind mr-1"></div>静默捕获异常
      </button>
      <button 
        v-else 
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
        @click="handleDisableMute"
      >
        <div class="i-icon-park-outline-remind mr-1"></div>启用异常提示
      </button>
    </div>

    <template v-if="logs.length">
      <div class="space-y-4">
        <div 
          v-for="logItem in logs" 
          :key="logItem.time"
          class="border rounded-lg p-4 relative"
        >
          <div class="text-gray-500 text-sm absolute right-4 top-4">
            {{ logItem.time }}
          </div>
          <h3 class="text-red-600 font-medium mb-2">{{ logItem.message }}</h3>
          <pre class="text-gray-600 text-sm whitespace-pre-wrap">{{ logItem.stack }}</pre>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center justify-center py-8 text-gray-500">
        <div class="i-icon-park-outline-folder-withdrawal text-4xl mb-2"></div>
        <span>没有错误日志</span>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Dialog from './Dialog.vue'
import { Message } from './Message'

const visible = defineModel<boolean>('visible', { required: true })

interface ErrorLogItem {
  time: string
  message: string
  stack: string
}

const logs = ref<ErrorLogItem[]>([])
const isMute = ref(false)

onMounted(() => {
  getErrorLogs()
})

// 获取错误缓存列表
const getErrorLogs = () => {
  logs.value = JSON.parse(localStorage.getItem("errorNotReport") || "[]")
}

// 错误上报
const handleReport = () => {
  Message({
    showClose: true,
    message: '开发中',
    type: 'warning',
  })
}

// 清空错误日志
const handleClear = () => {
  localStorage.setItem("errorNotReport", JSON.stringify([]))
  logs.value = []
  Message({
    showClose: true,
    message: '日志已清空',
    type: 'success',
  })
}

// 静默异常捕获，不提示
const handleMute = () => {
  isMute.value = true
  Message({
    showClose: true,
    message: '已启用静默',
    type: 'warning',
  })
  localStorage.setItem("isMuteErrorCatch", 'true')
}

// 启用异常捕获提示
const handleDisableMute = () => {
  isMute.value = false
  Message({
    showClose: true,
    message: '已关闭静默',
    type: 'success',
  })
  localStorage.setItem("isMuteErrorCatch", 'false')
}
</script>