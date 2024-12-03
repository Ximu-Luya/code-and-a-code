<template>
  <Transition
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight"
  >
    <div 
      v-if="visible"
      class="fixed top-8 right-4 z-[9999] rounded-lg shadow-lg min-w-350px overflow-hidden"
      :class="typeClass"
    >
      <!-- 标题区域 -->
      <div class="flex items-center px-4 py-3 border-b border-white/20">
        <!-- 图标和标题 -->
        <div :class="iconClass" class="mr-2 text-lg"></div>
        <span class="flex-1 font-medium">{{ title || defaultTitle }}</span>
        
        <!-- 关闭按钮 -->
        <div 
          v-if="props.showClose"
          class="ml-2 cursor-pointer"
          @click="close"
        >
          <div class="i-icon-park-outline-close"></div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="px-4 py-3">
        {{ props.content }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

export interface NotificationProps {
  title?: string
  content: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
  showClose?: boolean
  onClose?: () => void
}

const props = withDefaults(defineProps<NotificationProps>(), {
  type: 'info',
  duration: 4500,
  showClose: true
})

const visible = ref(false)

// 默认标题
const defaultTitle = computed(() => {
  const titles = {
    success: '成功',
    warning: '警告',
    error: '错误',
    info: '提示'
  }
  return titles[props.type]
})

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

// 关闭通知
const close = () => {
  visible.value = false
  props.onClose?.()
}

// 自动关闭
if (props.duration > 0) {
  setTimeout(close, props.duration)
}

onMounted(() => {
  visible.value = true // 初始化时不展示，挂载后设置为true使其有过渡动画
})
</script> 