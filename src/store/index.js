import { createStore } from 'vuex'

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
        width: 50,
        height: 60
      },
      // 缓存堆最大容量
      cacheMax: 6,
      // 每组相同卡片数量
      perGroup: 3,
      // 卡牌组数
      groupCount: 20,
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
      state.allCards = []
      state.deck = []
      state.cache = []

      for (let cardCode = 1, id = 0; cardCode <= options.groupCount; cardCode++) {
        for (let cardCount = 0; cardCount < options.perGroup; cardCount++) {
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
        x: state.boxPos.cacheBoxPos.x + (state.cache.length - 1) * 50,
        y: state.boxPos.cacheBoxPos.y,
      }
    },
    /**
     * 消除总卡牌数据中相同的卡牌
     * @param state
     * @param currentCard 卡牌数据
     */
    removeSameCard(state, currentCard) {
      state.cache = state.cache.filter(item => item.code !== currentCard.code)
      state.allCards = state.allCards.filter(item => item.code !== currentCard.code)
    },
    /**
     * 重新计算缓存堆中卡牌的坐标
     * @param state
     */
    rerenderCacheBox(state) {
      state.cache.forEach((item, index) => {
        item.pos.x = state.boxPos.cacheBoxPos.x + index * 50
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
      // 如果该卡牌在缓存堆中的数量达到3张
      if (targets.length === 3) {
        // 所有缓存堆中将要消除的相同卡牌
        const sameCard = state.allCards.filter(item => item.code === currentCard.code)
        // 执行消除动画
        sameCard.forEach(item => (item.disappearing = true))
        // 延时消除动画的时间后，从总卡牌数据中消除卡牌
        setTimeout(() => {
          commit('removeSameCard', currentCard)
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
