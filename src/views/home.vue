<template>
  <div class="home">
    <card v-for="item in allCards" :key="item" :card-data="item"></card>
    
    <div class="deck">
      <div class="deck-box" :style="deckBoxSize"></div>
    </div>
    <div class="cache">
      <div class="cache-box" :style="cacheBoxSize"></div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/card.vue'
import CacheBox from '@/components/cacheBox.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    Card,
    CacheBox
  },
  computed: {
    ...mapState(['allCards', 'options', 'boxPos']),
    // 牌堆尺寸
    deckBoxSize(){
      const { deckBoxPos } = this.boxPos
      return {
        width: `${deckBoxPos.right - deckBoxPos.left}px`,
        height: `${deckBoxPos.bottom - deckBoxPos.top}px`
      }
    },
    // 缓存堆尺寸
    cacheBoxSize(){
      const { cacheMax, card } = this.options
      return {
        width: `${cacheMax * card.width}px`,
        height: `${card.height}px`
      }
    }
  },
  mounted(){
    this.initPos()
    // 初始化牌堆
    this.initDeck({groupCount: 3, perGroup: 3})
  },
  methods: {
    ...mapMutations(['initDeck', 'initBoxPos']),
    /**
     * 初始化页面各容器坐标
     */
    initPos(){
      // 获取缓存堆与页面的坐标
      const pagePos = document.querySelector(".page").getBoundingClientRect()
      const cacheBoxPos = document.querySelector(".cache-box").getBoundingClientRect()

      // 初始化缓存堆相对页面的坐标
      this.initBoxPos({
        deckBoxPos: {
          top: 50,
          bottom: cacheBoxPos.y - 50,
          left: 50,
          right: pagePos.width - 50,
        },
        cacheBoxPos: {
          x: cacheBoxPos.x - pagePos.x,
          y: cacheBoxPos.y
        },
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;

  .deck{
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
    padding: 10px;
    
    border: 2px solid #606266;
  }
  .cache{
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    border: 2px solid #606266;
    background-color: #C0C4CC;
    z-index: 0;
  }
}
</style>