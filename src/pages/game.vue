<template>
  <div class="game">
    <TopNav title="Game" />
    <CodeCard v-for="item in gameStore.allCards" :key="item.id" :card-data="item" />

    <div class="deck" :style="deckBoxPos">
      <div class="border"></div>
    </div>
    <div class="cache" :style="cacheBoxSize">
      <div class="border"></div>
    </div>

    <div class="game-function">
      <div class="item" @click="refreshItemVisible = true">
        <span>重新打乱牌堆</span>
      </div>

      <div class="item" @click="backItemVisible = true">
        <span>卡牌返回牌堆</span>
      </div>
    </div>

    <ItemDialog
      v-model:visible="refreshItemVisible"
      :item-data="{
        prop: 'refresh',
        description: '使用道具可以重新随机生成卡牌在牌堆中的位置'
      }"
    />
    <ItemDialog
      v-model:visible="backItemVisible"
      :item-data="{
        prop: 'back',
        description: '使用道具可以让缓存区的卡牌返回牌堆中的随机位置'
      }"
    />

    <!-- 游戏锁定遮罩，防止玩家在游戏动画进行时操作 -->
    <div class="game-lock-mask" v-if="gameStore.gameLocked"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CodeCard from '@/components/CodeCard.vue'
import ItemDialog from '@/components/ItemDialog.vue'
import TopNav from '@/components/TopNav.vue'
import { useGameStore } from '@/store'

const refreshItemVisible = ref(false)
const backItemVisible = ref(false)

const gameStore = useGameStore()
// 牌堆样式
const deckBoxPos = computed(() => {
  const { deckBoxPos } = gameStore.gameContainerPos
  return {
    left: `${deckBoxPos.left}px`,
    top: `${deckBoxPos.top}px`,
    width: `${deckBoxPos.width}px`,
    height: `${deckBoxPos.height}px`
  }
})

// 缓存区尺寸
const cacheBoxSize = computed(() => {
  const { cacheMax, card } = gameStore.gameOptions
  return {
    width: `${cacheMax * card.width}px`,
    height: `${card.height}px`
  }
})

onMounted(() => {
  // 初始化页面各容器坐标
  initPos()
  // 初始化牌堆
  gameStore.initGame()
})

const initPos = () => {
  // 获取缓存堆与页面的坐标
  const pagePos = document.querySelector('.game')!.getBoundingClientRect()
  const cacheBoxPos = document.querySelector('.cache')!.getBoundingClientRect()

  let deckHorizontalOffset, cardSize
  if (pagePos.width < 400) {
    deckHorizontalOffset = 20
    cardSize = 40
  } else {
    deckHorizontalOffset = 50
    cardSize = 50
  }
  // 设置卡牌尺寸
  gameStore.setCardSize(cardSize)

  // 初始化缓存堆相对页面的坐标
  gameStore.initBoxPos({
    // 牌堆可用区域
    deckBoxPos: {
      top: 70,
      bottom: cacheBoxPos.y - 50,
      left: deckHorizontalOffset,
      right: pagePos.width - deckHorizontalOffset
    },
    cacheBoxPos: {
      x: cacheBoxPos.x - pagePos.x,
      y: cacheBoxPos.y
    }
  })
}
</script>

<style lang="scss" scoped>
.game {
  position: relative;
  width: 100%;
  height: 100%;

  .deck{
    position: absolute;
    z-index: 0;

    .border {
      box-sizing: content-box;
      height: calc(100% + 20px);
      width: calc(100% + 20px);
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid #606266;
    }
  }
  .cache{
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;

    .border {
      box-sizing: content-box;
      height: calc(100% + 10px);
      width: calc(100% + 10px);
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid #606266;
      background-color: #c0c4cc;
    }
  }

  .game-function{
    position: absolute;
    bottom: 20px;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    justify-content: space-around;

    .item {
      padding: 10px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-radius: 4px;
      background-color: #606266;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .game-lock-mask {
    position: absolute;
    left: 0;
    width: 100%;
    top: 60px; bottom: 0;
    z-index: 2000;
    // 用于调试 游戏画面锁定遮罩
    // background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>
