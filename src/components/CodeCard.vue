<template>
  <div
    class="card-item layout-center box-shadow"
    :class="{
      hide: cardData.isDisappearing,
      border: !cardData.isCovered
    }"
    @click="handleClick"
    :style="style"
  >
    <div class="content">
      <div class="img-box">
        <img
          :src="CardIconSet[cardData.code].src"
          :alt="`${CardIconSet[cardData.code].name}[${cardData.code}]`"
          draggable="false"
        />
      </div>
    </div>
    <div
      class="mask"
      :class="{ show: cardData.isCovered, hide: !cardData.isCovered }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CardIconData from '@/assets/cardicons.json'
import { type Card, useGameStore } from '@/store'

const gameStore = useGameStore()

const { cardData } = defineProps<{ cardData: Card }>()

const style = computed(() => ({
  transform: `translate3d(${cardData.pos.x}px, ${cardData.pos.y}px, 0)`,
  width: `${gameStore.gameOptions.card.width}px`,
  height: `${gameStore.gameOptions.card.height}px`
}))

const CardIconSet = ref(CardIconData[gameStore.gameOptions.group.name])

const handleClick = () => {
  if (cardData.isCached) return
  if (cardData.isCovered) return

  gameStore.saveInCache(cardData)
}
</script>

<style lang="scss" scoped>
.card-item{
  position: absolute;
  // translate原点
  left: 0; top: 0;

  border-radius: 4px;
  background-color: #fff;

  transition: .3s;
  z-index: 2;

  // 卡片阴影
  &.box-shadow {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }

  &.border {
    border: 1px solid #ebeef5;
  }

  &.hide {
    opacity: 0;
  }

  // 卡片内部布局
  &.layout-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content {
    font-size: 14px;
    width: 100%;
    height: 100%;
    position: relative;

    .img-box {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 90%;
        max-height: 90%;
        object-fit: scale-down;
      }
    }
  }

  // 卡牌被覆盖的遮罩
  .mask{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0; top: 0;
    border-radius: 4px;
    background-color: #000;
    transition: .3s;

    &.show{
      opacity: 0.6;
    }

    &.hide {
      opacity: 0;
    }
  }
}
</style>
