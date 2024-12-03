<template>
  <Dialog v-model:visible="visible" title="道具使用">
    <div class="flex flex-col items-center gap-3">
      <div class="text-gray-600">当前拥有：{{ count }} 个</div>
      <div class="text-gray-600">{{ itemData.description }}</div>
      <div class="flex gap-3">
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          @click="getItem"
        >
          获得一个
        </button>
        <button 
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          @click="useItem"
        >
          使用一个
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/store'
import Dialog from './Dialog.vue'
import { Notification } from './Notification'

const gameStore = useGameStore()
const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  itemData: {
    prop: 'refresh' | 'back'
    description: string
  }
}>()

const count = ref(0)

const getItem = () => {
  count.value++
  Notification({
    type: 'success',
    content: `获得一个${props.itemData.prop}道具`,
    showClose: true
  })
}

const useItem = () => {
  if (count.value === 0) {
    Notification({
      type: 'warning',
      content: '道具剩余数量不够啦',
      showClose: true
    })
    return
  }

  const operation = {
    'refresh': gameStore.refreshDeck,
    'back': gameStore.moveAllToDeck
  }
  
  count.value--
  operation[props.itemData.prop]()
  Notification({
    type: 'success',
    content: '道具使用成功',
    showClose: true
  })
  visible.value = false
}
</script>
