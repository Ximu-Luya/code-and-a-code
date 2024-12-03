<template>
  <Transition
    enter-active-class="animate__animated animate__fadeInDown"
    leave-active-class="animate__animated animate__fadeOutUp"
  >
    <div 
      v-if="visible"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center px-4 py-2 rounded-lg shadow-lg min-w-300px"
      :class="typeClass"
    >
      <!-- 消息图标 -->
      <div :class="iconClass" class="mr-2 text-lg"></div>
      
      <!-- 消息内容 -->
      <span class="flex-1">{{ props.message }}</span>
      
      <!-- 关闭按钮 -->
      <div 
        v-if="props.showClose"
        class="ml-2 cursor-pointer opacity-60 hover:opacity-100"
        @click="close"
      >
        <div class="i-icon-park-outline-close"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface MessageProps {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
  showClose?: boolean
  onClose?: () => void
}

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000,
  showClose: false
})

const visible = ref(true)

// 根据类型计算样式
const typeClass = computed(() => {
  const classes = {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  return classes[props.type]
})

// 根据类型计算图标
const iconClass = computed(() => {
  const icons = {
    success: 'i-icon-park-outline-check-one',
    warning: 'i-icon-park-outline-attention',
    error: 'i-icon-park-outline-close',
    info: 'i-icon-park-outline-info'
  }
  return icons[props.type]
})

// 关闭消息
const close = () => {
  visible.value = false
  props.onClose?.()
}

// 自动关闭
if (props.duration > 0) {
  setTimeout(close, props.duration)
}
</script> 