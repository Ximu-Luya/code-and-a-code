<template>
  <div class="home">
    <card v-for="item in cardsData" :key="item" :card-data="item"></card>
    
    <div class="cache-box"></div>
  </div>
</template>

<script>
import Card from '@/components/card.vue'
import CacheBox from '@/components/cacheBox.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    Card,
    CacheBox
  },
  data(){
    return {
      cardsData: []
    }
  },
  computed: {},
  mounted(){
    this.initDeck({groupCount: 3, perGroup: 3})
    this.cardsData = Object.assign({}, this.getDeck())
    // 获取缓存堆与页面的坐标
    const cacheBoxPos = document.querySelector(".cache-box").getBoundingClientRect()
    const pagePos = document.querySelector(".page").getBoundingClientRect()
    // 初始化缓存堆相对页面的坐标
    this.initCacheBoxPos({x: cacheBoxPos.x - pagePos.x, y: cacheBoxPos.y})
  },
  methods: {
    ...mapMutations(['initDeck', 'initCacheBoxPos']),
    ...mapGetters(['getDeck'])
  }
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;

  .cache-box{
    position: absolute;
    bottom: 40px;
    width: 75%;
    height: 60px;
    left: 50%;
    transform: translateX(-50%);
    border: 2px solid #606266;
    background-color: #C0C4CC;
    z-index: 0;
  }
}
</style>