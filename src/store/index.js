import { createStore } from 'vuex'

// 生产随机数
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

export default createStore({
  state: {
    allCards: [],
    deck: [],
    cache: [],
    cacheBoxPos: {
      x: 0,
      y: 0
    }
  },
  getters: {
    getDeck(state){
      return state.deck
    }
  },
  mutations: {
    /**
     * 初始化缓存堆坐标
     * @param state 
     * @param {x, y} pos 坐标
     */
    initCacheBoxPos(state, pos){
      state.cacheBoxPos.x = pos.x
      state.cacheBoxPos.y = pos.y
    },
    /**
     * 初始化牌堆
     * @param state 
     * @param {groupCount, perGroup} {牌组数, 每组相同牌数量}
     */
    initDeck(state, {groupCount=1, perGroup=2}){
      for(let cardCode=1, id=0; cardCode<=groupCount; cardCode++){
        for(let cardCount=0; cardCount<perGroup; cardCount++){
          state.allCards.push({
            id: id++,
            code: cardCode,
            pos: {
              x: getRandomInt(0, 500),
              y: getRandomInt(0, 700)
            },
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
    moveToCache(state, currentCard){
      const target = state.deck.findIndex(item => item.id === currentCard.id)
      if (target < 0) return alert("该卡牌不存在")

      state.deck.splice(target, 1)[0]
      state.cache.push(currentCard)

      currentCard.pos = {
        x: state.cacheBoxPos.x + (state.cache.length-1) * 50,
        y: state.cacheBoxPos.y
      }
    },
    /**
     * 卡牌打到规定数量进行消除
     * @param state 
     * @param {id, code, pos} currentCard 卡牌数据
     */
    removeSameCard(state, currentCard){
      state.cache = state.cache.filter(item => item.code !== currentCard.code)
      state.allCards = state.allCards.filter(item => item.code !== currentCard.code)
    },
    /**
     * 重新计算缓存堆卡牌的坐标
     * @param state 
     */
    rerenderCacheBox(state) {
      state.cache.forEach((item, index) => {
        item.pos.x = state.cacheBoxPos.x + index * 50
      })
    },
  },
  actions: {
    saveInCache({state, commit}, currentCard){
      commit('moveToCache', currentCard)

      const targets = state.cache.filter(item => item.code === currentCard.code)
      console.log(targets)
      // 如果该卡牌数量达到3张，返回没有该卡牌的缓存堆，即消除卡牌
      if(targets.length === 3){
        commit('removeSameCard', currentCard)
        commit('rerenderCacheBox')
      }
    }
  },
  modules: {
  }
})
