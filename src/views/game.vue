<template>
  <div class="game">
    <top-nav title="Game">
      <template #extra v-if="false">
        <el-button>游戏设置</el-button>
      </template>
    </top-nav>
    <card v-for="item in allCards" :key="item.id" :card-data="item"></card>
    
    <div class="deck" :style="deckBoxPos">
      <div class="border"></div>
    </div>
    <div class="cache" :style="cacheBoxSize">
      <div class="border" ></div>
    </div>

    <div class="game-function">
      <el-badge :value="items.refresh">
        <div class="item" @click="this.refreshItemVisible = true">
          <span>重新打乱牌堆</span>
        </div>
      </el-badge>

      <el-badge :value="items.back">
        <div class="item" @click="this.backItemVisible = true">
          <span>卡牌返回牌堆</span>
        </div>
      </el-badge>
    </div>

    <item-dialog
      v-model:visible="refreshItemVisible"
      :item-data="{
        prop: 'refresh',
        description: '使用道具可以重新随机生成卡牌在牌堆中的位置'
      }"
    ></item-dialog>
    <item-dialog
      v-model:visible="backItemVisible"
      :item-data="{
        prop: 'back',
        description: '使用道具可以让缓存区的卡牌返回牌堆中的随机位置'
      }"
    ></item-dialog>

    <!-- 游戏锁定遮罩，防止玩家在游戏动画进行时操作 -->
    <div class="game-lock-mask" v-if="gameLocked"></div>
  </div>
</template>

<script>
import TopNav from '@/components/topNav.vue'
import Card from '@/components/card.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import ItemDialog from '@/components/itemDialog.vue'
export default {
  components: {
    Card,
    TopNav,
    ItemDialog
  },
  data(){
    return {
      refreshItemVisible: false,
      backItemVisible: false
    }
  },
  computed: {
    ...mapState([
      'allCards',
      'options',
      'boxConfig',
      'gameLocked',
      'items',
    ]),
    // 牌堆尺寸
    deckBoxPos(){
      const { deckBoxPos } = this.boxConfig
      return {
        left: `${deckBoxPos.left}px`,
        top: `${deckBoxPos.top}px`,
        width: `${deckBoxPos.width}px`,
        height: `${deckBoxPos.height}px`,
      }
    },
    // 缓存堆尺寸
    cacheBoxSize(){
      const { cacheMax, card } = this.options
      return {
        width: `${cacheMax * card.width}px`,
        height: `${card.height}px`
      }
    },
  },
  mounted(){
    this.initPos()
    // 初始化牌堆
    this.initGame()
  },
  methods: {
    ...mapMutations(['initBoxPos', 'setCardSize']),
    ...mapActions(['initGame', 'moveAllToDeck', 'refreshDeck']),
    /**
     * 初始化页面各容器坐标
     */
    initPos(){
      // 获取缓存堆与页面的坐标
      const pagePos = document.querySelector(".game").getBoundingClientRect()
      const cacheBoxPos = document.querySelector(".cache").getBoundingClientRect()

      let deckHorizontalOffset, cardSize
      if ( pagePos.width < 400 ){
        deckHorizontalOffset = 20
        cardSize = 40
      } else {
        deckHorizontalOffset = 50
        cardSize = 50
      }
      // 设置卡牌尺寸
      this.setCardSize(cardSize)

      // 初始化缓存堆相对页面的坐标
      this.initBoxPos({
        // 牌堆可用区域
        deckBoxPos: {
          top: 70,
          bottom: cacheBoxPos.y - 50,
          left: deckHorizontalOffset,
          right: pagePos.width - deckHorizontalOffset,
        },
        cacheBoxPos: {
          x: cacheBoxPos.x - pagePos.x,
          y: cacheBoxPos.y
        },
      })
    },
  }
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