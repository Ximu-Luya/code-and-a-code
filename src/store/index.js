import { createStore } from 'vuex'

// 生产随机数
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

export default createStore({
  state: {
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
      console.log(state.cacheBoxPos)
    },
    /**
     * 初始化牌堆
     * @param state 
     * @param {groupCount, perGroup} {牌组数, 每组相同牌数量}
     */
    initDeck(state, {groupCount=1, perGroup=2}){
      for(let cardCode=1, id=0; cardCode<=groupCount; cardCode++){
        for(let cardCount=0; cardCount<perGroup; cardCount++){
          state.deck.push({
            id: id++,
            code: cardCode,
            pos: {
              x: getRandomInt(0, 500),
              y: getRandomInt(0, 800)
            },
          })
        }
      }
    },
    /**
     * 卡片从牌堆移入缓存堆
     * @param state 
     * @param id 卡片id
     */
    moveToCache(state, id){
      const target = state.deck.findIndex(item => item.id === id)
      if (target < 0) return alert("该卡牌不存在")

      const currentCard = state.deck.splice(target, 1)[0]
      state.cache.push(currentCard)

      currentCard.pos = {
        x: state.cacheBoxPos.x + (state.cache.length-1) * 50,
        y: state.cacheBoxPos.y
      }
    },
    
  },
  actions: {

  },
  modules: {
  }
})
