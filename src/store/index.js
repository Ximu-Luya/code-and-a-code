import { createStore } from 'vuex'
import CardIconData from '@/assets/card.icon.json'

// 生产随机数
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
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
    boxPos: {
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
    },
    // 可选项
    options: {
      // 卡牌大小
      card: {
        width: 60,
        height: 70
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
     * 初始化缓存堆坐标
     * @param state
     * @param pos 牌堆与缓存堆坐标
     */
    initBoxPos(state, pos) {
      state.boxPos.deckBoxPos.top = pos.deckBoxPos.top
      state.boxPos.deckBoxPos.bottom = pos.deckBoxPos.bottom
      state.boxPos.deckBoxPos.left = pos.deckBoxPos.left
      state.boxPos.deckBoxPos.right = pos.deckBoxPos.right
      state.boxPos.cacheBoxPos.x = pos.cacheBoxPos.x
      state.boxPos.cacheBoxPos.y = pos.cacheBoxPos.y
    },
    /**
     * 初始化牌堆
     * @param state
     */
    initDeck(state) {
      const { boxPos, options } = state
      // 卡牌组数 = 卡牌Icon数组长度
      const groupCount = CardIconData[options.group.name].length
      // 每组卡牌数 = 卡牌消除数 * 消除数倍数
      const perGroup = options.group.removeCount * options.group.rmCountMultiple
      state.allCards = []
      state.deck = []
      state.cache = []

      for (let cardCode = 0, id = 0; cardCode < groupCount; cardCode++) {
        for (let cardCount = 0; cardCount < perGroup; cardCount++) {
          state.allCards.push({
            id: id++,
            code: cardCode,
            pos: {
              x: getRandomInt(boxPos.deckBoxPos.left, boxPos.deckBoxPos.right - options.card.width),
              y: getRandomInt(boxPos.deckBoxPos.top, boxPos.deckBoxPos.bottom - options.card.height),
            },
            disappearing: false,
            cached: false
          })
        }
      }

      // 所有卡牌初始在牌堆中
      state.deck = state.allCards.map(item => item)
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
        x: state.boxPos.cacheBoxPos.x + (state.cache.length - 1) * state.options.card.width,
        y: state.boxPos.cacheBoxPos.y,
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
        item.pos.x = state.boxPos.cacheBoxPos.x + index * state.options.card.width
      })
    },
    /**
     * 重新排列牌堆中的卡牌
     * @param state 
     */
    refreshDeck(state){
      const { boxPos, options } = state
      // 重新随机生成牌堆中所有卡牌的坐标
      state.deck.forEach(item => {
        item.pos.x = getRandomInt(boxPos.deckBoxPos.left, boxPos.deckBoxPos.right - options.card.width)
        item.pos.y = getRandomInt(boxPos.deckBoxPos.top, boxPos.deckBoxPos.bottom - options.card.height)
      })
    },
    /**
     * 将缓存堆中的卡牌重新移入牌堆中
     * @param state 
     */
    moveToDeck(state){
      const { boxPos, options } = state
      // 移除缓存堆中的所有卡牌
      const toDeckCards = state.cache.splice(0, state.cache.length)
      // 将移除的卡牌，重新生成其在牌堆中的坐标
      toDeckCards.forEach(item => {
        item.pos.x = getRandomInt(boxPos.deckBoxPos.left, boxPos.deckBoxPos.right - options.card.width)
        item.pos.y = getRandomInt(boxPos.deckBoxPos.top, boxPos.deckBoxPos.bottom - options.card.height)
        // 设置缓存状态为false
        item.cached = false
      })
      // 将从缓存堆中移除的卡牌加入牌堆中
      state.deck.push(...toDeckCards)
    }
  },
  actions: {
    /**
     * 点击卡牌，移入缓存堆，进行后续决策
     * @param context
     * @param currentCard 当前卡牌数据
     */
    async saveInCache({ state, commit }, currentCard) {
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
            commit('initDeck')
          }
        }, 1000)
      } else {
        // 缓存堆卡牌达到数量上限且无法消除卡牌，则游戏结束
        if(state.cache.length === state.options.cacheMax) {
          setTimeout(() => {
            alert('游戏结束，点击确定重新开始')
            commit('initDeck')
          }, 310);
          return 
        }
      }
    },
  },
  modules: {},
})
