<template>
  <Teleport to="body">
    <!-- 遮罩层过渡 -->
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div 
        v-if="visible" 
        class="fixed inset-0 bg-black/50 z-[999]"
        @click="handleClose"
      ></div>
    </Transition>

    <!-- 对话框过渡 -->
    <Transition
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut"
    >
      <div 
        v-if="visible" 
        class="fixed inset-4 flex items-center justify-center z-[1000]"
        @click="handleClose"
      >
        <div 
          class="bg-white rounded-lg shadow-lg min-w-350px max-h-[calc(100vh-2rem)] flex flex-col"
          :style="{ width: props.width }"
          @click.stop
        >
          <!-- 标题栏 -->
          <div class="px-6 py-6 border-b flex items-center justify-between shrink-0">
            <div class="text-xl font-medium">{{ props.title }}</div>
            <div 
              class="i-icon-park-outline-close text-xl text-gray-400 hover:text-gray-600 cursor-pointer"
              @click="handleClose"
            ></div>
          </div>
          
          <!-- 内容区 -->
          <div class="p-6 overflow-auto">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const props = defineProps<{
  title: string
  width?: string
}>()

const visible = defineModel<boolean>('visible', { required: true })

const handleClose = () => {
  visible.value = false
}
</script>

<style>
.animate__animated {
  animation-duration: 0.3s;
}
</style>
