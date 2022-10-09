import { createStore } from 'vuex'
import CardIconData from '@/assets/card.icon.json'
import _ from "lodash"

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export default createStore({
  state: {
    // 总卡牌数据
    allCards: [],
    // 牌堆
    deck: [],
    // 缓存堆
    cache: [],
    // 页面容器坐标
    boxConfig: {
      deckBoxPos: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      cacheBoxPos: {
        x: 0,
        y: 0,
      },
      deckGrid: {
        row: 0,
        column: 0
      }
    },
    // 可选项
    options: {
      // 卡牌大小
      card: {
        width: 70,
        height: 80
      },
      // 缓存堆最大容量
      cacheMax: 6,
      group: {
        name: 'FrontEnd',
        // 多少张牌可以消除
        removeCount: 3,
        /**
         * 每组卡牌数为消除数的多少倍
         * 总相同卡牌数 = removeCount * rmCountMultiple
         * 即3张牌可以消除，倍数为2，则牌堆中每组相同的卡牌有2*3=6张
         * 组数为卡片icon数量
         */
        rmCountMultiple: 2,
      }
    },
  },
  getters: {},
  mutations: {
    /**
     * 初始化页面容器坐标
     * @param state
     * @param pos 牌堆与缓存堆坐标
     */
    initBoxPos(state, { deckBoxPos, cacheBoxPos }) {
      const { card } = state.options

      // 以卡牌长宽为一个方格，计算整数个方格划分牌堆后的实际牌堆偏移量
      const deckHorizontalOffset = ((deckBoxPos.right - deckBoxPos.left) % card.width) / 2
      const deckVerticalOffset = ((deckBoxPos.bottom - deckBoxPos.top) % card.height) / 2
      
      // 计算方格后的牌堆坐标
      const realDeckPos = {
        top: deckBoxPos.top + deckVerticalOffset,
        bottom: deckBoxPos.bottom - deckVerticalOffset,
        left: deckBoxPos.left + deckHorizontalOffset,
        right: deckBoxPos.right - deckHorizontalOffset,
      }
      // 牌堆长宽参数
      realDeckPos.width = realDeckPos.right - realDeckPos.left
      realDeckPos.height = realDeckPos.bottom - realDeckPos.top

      state.boxConfig.deckBoxPos = realDeckPos

      // 牌堆网格参数
      state.boxConfig.deckGrid.row = realDeckPos.width / card.width
      state.boxConfig.deckGrid.column = realDeckPos.height / card.height

      // 缓存堆坐标
      state.boxConfig.cacheBoxPos.x = cacheBoxPos.x
      state.boxConfig.cacheBoxPos.y = cacheBoxPos.y
    },
    /**
     * 初始化牌堆
     * @param state
     */
    initCardData(state) {
      const { boxConfig, options } = state
      // 卡牌组数 = 卡牌Icon数组长度
      const groupCount = CardIconData[options.group.name].length
      // 每组卡牌数 = 卡牌消除数 * 消除数倍数
      const perGroup = options.group.removeCount * options.group.rmCountMultiple
      state.allCards = []
      state.deck = []
      state.cache = []
      // 卡牌初始在牌堆中央
      const deckBoxCenter = {
        x: boxConfig.deckBoxPos.left + (boxConfig.deckBoxPos.right - boxConfig.deckBoxPos.left - options.card.width) / 2,
        y: boxConfig.deckBoxPos.top + (boxConfig.deckBoxPos.bottom - boxConfig.deckBoxPos.top - options.card.height) / 2
      }

      for (let cardCode = 0, id = 0; cardCode < groupCount; cardCode++) {
        for (let cardCount = 0; cardCount < perGroup; cardCount++) {
          state.allCards.push({
            id: id++,
            code: cardCode,
            pos: {
              x: deckBoxCenter.x,
              y: deckBoxCenter.y,
            },
            disappearing: false,
            cached: false,
          })
        }
      }

      state.allCards = _.shuffle(state.allCards)
      // 所有卡牌初始在牌堆中
      state.deck = state.allCards.map(item => item)
    },
    /**
     * 随机设置卡牌位置
     * @param state 
     */
    randomCardPos(state, currentCard){
      const { deckGrid, deckBoxPos } = state.boxConfig
      const { card } = state.options
      const rowOffset = _.random(deckGrid.row - 1)
      const columnOffset = _.random(deckGrid.column - 1)

      currentCard.pos = {
        x: deckBoxPos.left + rowOffset * card.width,
        y: deckBoxPos.top + columnOffset * card.height
      }
    },
    /**
     * 卡牌从牌堆移入缓存堆
     * @param state
     * @param currentCard 卡牌数据
     */
    moveToCache(state, currentCard) {
      const target = state.deck.findIndex(item => item.id === currentCard.id)
      if (target < 0) return alert('该卡牌不存在')

      state.deck.splice(target, 1)
      state.cache.push(currentCard)
      // 设置缓存状态为true，使其不可继续点击
      currentCard.cached = true

      currentCard.pos = {
        x: state.boxConfig.cacheBoxPos.x + (state.cache.length - 1) * state.options.card.width,
        y: state.boxConfig.cacheBoxPos.y,
      }
    },
    /**
     * 消除缓存堆中Code相同的卡牌
     * @param state
     * @param sameCards 将要消除的卡牌数组
     */
    removeSameCardInCache(state, sameCards) {
      state.cache = state.cache.filter(item => {
        return !sameCards.some(sameCard => sameCard.id === item.id)
      })
    },
    /**
     * 消除总卡牌数据中Code相同的卡牌
     * @param state
     * @param sameCards 将要消除的卡牌数组
     */
    removeSameCardInAll(state, sameCards) {
      state.allCards = state.allCards.filter(item => {
        return !sameCards.some(sameCard => sameCard.id === item.id)
      })
    },
    /**
     * 重新计算缓存堆中卡牌的坐标
     * @param state
     */
    rerenderCacheBox(state) {
      state.cache.forEach((item, index) => {
        item.pos.x = state.boxConfig.cacheBoxPos.x + index * state.options.card.width
      })
    },
  },
  actions: {
    /**
     * 初始化游戏
     * @param context 
     */
    async initGame({ state, commit }) {
      commit('initCardData')
      for(let i=0; i<state.deck.length; i++){
        await delay(10)
        commit('randomCardPos', state.deck[i])
      }
    },
    /**
     * 点击卡牌，移入缓存堆，进行后续决策
     * @param context
     * @param currentCard 当前卡牌数据
     */
    async saveInCache({ state, commit, dispatch }, currentCard) {
      // 缓存堆达到数量上限时，不允许继续添加卡牌
      if(state.cache.length === state.options.cacheMax) return
      // 卡牌移入缓存堆
      commit('moveToCache', currentCard)

      // 在缓存堆中寻找与当前卡牌code值相同的卡牌
      const targets = state.cache.filter(item => item.code === currentCard.code)
      // 如果该卡牌在缓存堆中的数量达到 设置中的消除数
      if (targets.length === state.options.group.removeCount) {
        // 获取所有缓存堆中将要消除的相同卡牌
        const sameCards = state.cache.filter(item => item.code === currentCard.code)
        // 先执行缓存堆中的卡牌消除，以防止在动画执行过程中继续添加卡牌导致游戏结束
        commit('removeSameCardInCache', sameCards)
        // 执行消除动画，延时300ms等待卡牌移动进入缓存堆
        setTimeout(() => {
          sameCards.forEach(item => (item.disappearing = true))
        }, 300);
        // 消除动画执行结束后，从总卡牌数据中消除卡牌
        setTimeout(() => {
          commit('removeSameCardInAll', sameCards)
          // 重新计算缓存堆中剩余卡牌的坐标
          commit('rerenderCacheBox')
          // 总卡牌数量为0，游戏胜利
          if (state.allCards.length === 0) {
            alert('游戏胜利，恭喜你')
            dispatch('initGame')
          }
        }, 1000)
      } else {
        // 缓存堆卡牌达到数量上限且无法消除卡牌，则游戏结束
        if(state.cache.length === state.options.cacheMax) {
          setTimeout(() => {
            alert('游戏结束，点击确定重新开始')
            dispatch('initGame')
          }, 310);
          return 
        }
      }
    },
    /**
     * 将缓存堆中的所有卡牌重新移入牌堆中
     * @param state 
     */
    moveAllToDeck({ state, commit }){
      // 移除缓存堆中的所有卡牌
      const toDeckCards = state.cache.splice(0, state.cache.length)
      // 将移除的卡牌，重新生成其在牌堆中的坐标
      toDeckCards.forEach(item => {
        commit('randomCardPos', item)
        // 设置缓存状态为false
        item.cached = false
      })
      // 将从缓存堆中移除的卡牌加入牌堆中
      state.deck.push(...toDeckCards)
    },
    /**
     * 重新排列牌堆中的卡牌
     * @param state 
     */
    async refreshDeck({ state, commit}){
      // 重新随机生成牌堆中所有卡牌的坐标
      for(let i=0; i<state.deck.length; i++){
        await delay(10)
        commit('randomCardPos', state.deck[i])
      }
    },
  },
  modules: {},
})
