<template>
  <div class="h-full w-full flex flex-col justify-center items-center relative bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
    <!-- 背景装饰元素 -->
    <div class="absolute top-0 left-0 w-full h-full opacity-20">
      <div class="absolute top-10% left-5% w-40 h-40 rounded-full bg-purple-500 blur-3xl"></div>
      <div class="absolute bottom-15% right-10% w-60 h-60 rounded-full bg-blue-500 blur-3xl"></div>
      <div class="absolute top-30% right-15% w-40 h-40 rounded-full bg-teal-500 blur-3xl"></div>
    </div>

    <!-- 代码打字机风格的标题 -->
    <div class="mb-10 md:mb-20 relative z-1 flex flex-col items-center w-full px-4">
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono font-bold mb-2 relative overflow-hidden whitespace-nowrap typing-container">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 typing-text">&lt;码了个码/&gt;</span>
        <span class="absolute right-0 top-0 h-full w-1 bg-cyan-400 animate-blink"></span>
      </h1>
      <div class="text-gray-400 font-mono text-xs sm:text-sm tracking-widest mb-3">
        <span class="text-green-400">&gt;</span> console.log(<span class="text-yellow-400">"Hello Coder!"</span>);
      </div>
      <div class="flex gap-2 mb-5">
        <div class="px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm text-xs font-mono border border-blue-500/50 shadow-lg shadow-blue-500/10 flex items-center">
          <div class="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-400 mr-1 sm:mr-1.5 animate-pulse"></div>
          <span>v{{ version }}</span>
        </div>
        <div class="px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-green-500/30 to-teal-500/30 backdrop-blur-sm text-xs font-mono border border-green-500/50 shadow-lg shadow-green-500/10">
          ready
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 w-80% sm:w-60% md:w-40% max-w-360px relative z-1 px-4">
      <RouterLink 
        to="/game" 
        class="px-4 sm:px-6 py-3 sm:py-4 text-center text-lg sm:text-xl font-bold rounded-xl 
        bg-gradient-to-r from-emerald-500 to-green-500 
        hover:from-emerald-600 hover:to-green-600
        shadow-lg hover:shadow-emerald-500/50
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        no-underline overflow-hidden group relative text-white"
      >
        <span class="relative z-10">开始游戏</span>
        <div class="absolute inset-0 h-full w-0 bg-white opacity-20 transition-all duration-300 group-hover:w-full"></div>
      </RouterLink>
      
      <div 
        class="px-4 sm:px-6 py-3 sm:py-4 text-center text-lg sm:text-xl font-bold rounded-xl
        bg-gradient-to-r from-amber-500 to-orange-500
        hover:from-amber-600 hover:to-orange-600
        shadow-lg hover:shadow-amber-500/50
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        cursor-pointer overflow-hidden group relative"
        @click="openChangeLog"
      >
        <span class="relative z-10">更新日志</span>
        <div class="absolute inset-0 h-full w-0 bg-white opacity-20 transition-all duration-300 group-hover:w-full"></div>
      </div>
      
      <div 
        class="px-4 sm:px-6 py-3 sm:py-4 text-center text-lg sm:text-xl font-bold rounded-xl
        bg-gradient-to-r from-rose-500 to-red-500
        hover:from-rose-600 hover:to-red-600
        shadow-lg hover:shadow-rose-500/50
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        cursor-pointer overflow-hidden group relative"
        @click="openErrorLog"
      >
        <span class="relative z-10">错误日志</span>
        <div class="absolute inset-0 h-full w-0 bg-white opacity-20 transition-all duration-300 group-hover:w-full"></div>
      </div>
    </div>

    <ChangeLog v-model:visible="changeLogVisible" />
    <ErrorLog v-model:visible="errorLogVisible" />

    <div class="absolute right-0 bottom-0 p-3 sm:p-5 flex items-center text-gray-300 text-xs sm:text-sm backdrop-blur-sm bg-black/10 rounded-tl-lg">
      Developed by 
      <a 
        href="https://github.com/Ximu-Luya" 
        target="_blank"
        class="text-blue-400 hover:text-blue-300 hover:underline mx-1 transition-colors duration-300"
      >
        @Ximu-Luya
      </a>
      Ver {{ version }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChangeLog from '@/components/ChangeLog.vue'
import ErrorLog from '@/components/ErrorLog.vue'
import changelogdata from '@/assets/changelog.json'

const version = ref(changelogdata[0].version)
const changeLogVisible = ref(false)
const errorLogVisible = ref(false)

const openChangeLog = () => {
  changeLogVisible.value = true
}

const openErrorLog = () => {
  errorLogVisible.value = true
}
</script>

<style scoped>
.typing-container {
  position: relative;
}

.typing-text {
  background-size: 200% auto;
  background-position: 0% center;
  animation: shine 3s linear infinite;
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes shine {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
</style>
