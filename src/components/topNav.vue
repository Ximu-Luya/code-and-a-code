<template>
  <div class="w-full px-4 h-14 flex items-center border-b border-gray-100">
    <RouterLink
      class="flex items-center cursor-pointer h-full flex items-center text-base-900 decoration-none"
      to="/"
    >
      <div class="i-icon-park-outline:arrow-left mr-2"></div>
      <span class="text-base-900">Back</span>
    </RouterLink>

    <div class="mx-3 h-4 w-px bg-gray-300"></div>

    <div class="text-lg font-medium text-base-900 h-full flex items-center">
      {{ props.title }}
    </div>

    <div class="flex items-center ml-auto">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>
