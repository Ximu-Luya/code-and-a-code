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
      card: {
        width: 50,
        height: 60
      },
      cacheMax: 6,
      groupCount: 20,
      perGroup: 3,
    },
  },
  getters: {},
  mutations: {
    /**
     * 初始化缓存堆坐标
     * @param state
     * @param {x, y} pos 坐标
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
     * @param {groupCount, perGroup} {牌组数, 每组相同牌数量}
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

      state.deck.splice(target, 1)[0]
      state.cache.push(currentCard)

      currentCard.pos = {
        x: state.boxPos.cacheBoxPos.x + (state.cache.length - 1) * 50,
        y: state.boxPos.cacheBoxPos.y,
      }
    },
    /**
     * 卡牌打到规定数量进行消除
     * @param state
     * @param {id, code, pos} currentCard 卡牌数据
     */
    removeSameCard(state, currentCard) {
      state.cache = state.cache.filter(item => item.code !== currentCard.code)
      state.allCards = state.allCards.filter(item => item.code !== currentCard.code)
    },
    /**
     * 重新计算缓存堆卡牌的坐标
     * @param state
     */
    rerenderCacheBox(state) {
      state.cache.forEach((item, index) => {
        item.pos.x = state.boxPos.cacheBoxPos.x + index * 50
      })
    },
  },
  actions: {
    /**
     * 点击卡片保存至缓存堆与后序决策
     * @param context
     * @param currentCard 当前卡牌数据
     */
    async saveInCache({ state, commit }, currentCard) {
      commit('moveToCache', currentCard)

      const targets = state.cache.filter(item => item.code === currentCard.code)
      // 如果该卡牌数量达到3张，返回没有该卡牌的缓存堆，即消除卡牌
      if (targets.length === 3) {
        const sameCard = state.allCards.filter(item => item.code === currentCard.code)
        sameCard.forEach(item => (item.disappearing = true))

        setTimeout(() => {
          commit('removeSameCard', currentCard)
          commit('rerenderCacheBox')
        }, 1000)
      } else {
        // 选择卡牌进入缓存堆后，没有消除卡牌且卡牌数量达到了缓存堆上限，则游戏结束
        if(state.cache.length === state.options.cacheMax) {
          setTimeout(() => {
            alert('游戏结束')
            commit('initDeck')
          }, 310);
          return 
        }
      }
    },
  },
  modules: {},
})
