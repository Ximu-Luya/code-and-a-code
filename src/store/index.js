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
    items: {
      // 刷新道具数量
      refresh: 1,
      // 返回牌堆道具数量
      back: 1,
    },
    // 页面容器坐标
    boxConfig: {
      // 牌堆四边位置
      deckBoxPos: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      // 缓存堆坐标
      cacheBoxPos: {
        x: 0,
        y: 0,
      },
      // 牌堆网格信息
      deckGrid: {
        row: 0,
        column: 0
      },
      // 牌堆中央坐标
      deckBoxCenter: {
        x: 0,
        y: 0
      }
    },
    // 可选项
    options: {
      // 卡牌大小
      card: {
        width: 50,
        height: 50
      },
      // 缓存堆最大容量
      cacheMax: 7,
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
    // 锁定游戏画面
    gameLocked: false
  },
  getters: {},
  mutations: {
    /**
     * 设置卡牌大小
     * @param state 
     * @param size 卡牌尺寸
     */
    setCardSize(state, size){
      state.options.card = { width: size, height: size }
    },
    /**
     * 初始化页面容器坐标
     * @param state
     * @param pos 牌堆与缓存堆坐标
     */
    initBoxPos(state, { deckBoxPos, cacheBoxPos }) {
      const { card } = state.options

      // 以卡牌长宽为一个方格，计算整数个方格划分牌堆后的实际牌堆偏移量
      let deckHorizontalOffset, deckVerticalOffset
      deckHorizontalOffset = ((deckBoxPos.right - deckBoxPos.left) % card.width) / 2
      deckVerticalOffset = ((deckBoxPos.bottom - deckBoxPos.top) % card.height) / 2

      // 如果水平与垂直方向长度大于 8个网格，限制网格为最大8个计算偏移量
      if(deckBoxPos.right - deckBoxPos.left - card.width * 8 > 0) {
        deckHorizontalOffset = (deckBoxPos.right - deckBoxPos.left - card.width * 8) / 2
      }
      if(deckBoxPos.bottom - deckBoxPos.top - card.height * 8 > 0) {
        deckVerticalOffset = (deckBoxPos.bottom - deckBoxPos.top - card.height * 8) / 2
      }
      
      // 计算网格化后的实际的牌堆尺寸
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

      // 牌堆中央坐标
      state.boxConfig.deckBoxCenter = {
        x: realDeckPos.left + (realDeckPos.right - realDeckPos.left - card.width) / 2,
        y: realDeckPos.top + (realDeckPos.bottom - realDeckPos.top - card.height) / 2
      }
    },
    /**
     * 初始化牌堆
     * @param state
     */
    initCardData(state) {
      const { group } = state.options
      // 卡牌组数 = 卡牌Icon数组长度
      const groupCount = CardIconData[group.name].length
      // 初始化元数据、牌堆、缓存堆
      state.allCards = []
      state.deck = []
      state.cache = []
      // 卡牌初始在牌堆中央
      const deckBoxCenter = state.boxConfig.deckBoxCenter
      let allCards = []

      // 随机 1/3 卡牌为卡牌数较少的稀有卡牌
      const rareCodes = _.sampleSize(_.range(groupCount), groupCount / 3)
      for (let cardCode = 0, id = 0; cardCode < groupCount; cardCode++) {
        // 每组卡牌数 = 卡牌消除数 * 消除数倍数(4组卡牌6张，8组卡牌15张)
        let perGroup = rareCodes.includes(cardCode) ? 2*group.removeCount : 5*group.removeCount
        for (let cardCount = 0; cardCount < perGroup; cardCount++) {
          allCards.push({
            id: id++,
            code: cardCode,
            pos: {
              x: deckBoxCenter.x,
              y: deckBoxCenter.y,
            },
            disappearing: false,
            isCover: false,
            cached: false
          })
        }
      }
      
      /**
       * 打乱数组前 2/3 的卡牌顺序
       * 即打乱底部最后 2/3 的卡牌顺序
       * 游戏进程的前 1/3 卡牌维持顺序保证游戏进程前半部分顺畅
       */
      allCards = [
        _.slice(allCards, 0, allCards.length * 3/4),
        _.slice(allCards, allCards.length * 3/4)
      ]
      allCards[0] = _.shuffle(allCards[0])
      state.allCards = _.flatMapDeep(allCards)
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
      // 随机水平与垂直网格偏移
      const rowGridOffset = _.random(deckGrid.row - 1)
      const columnGridOffset = _.random(deckGrid.column - 1)
      // 随机水平与垂直卡牌内偏移
      let rowOffset, columnOffset
      do {
        rowOffset = _.random(-1, 1) * card.width / 2
        columnOffset = _.random(-1 , 1) * card.height / 2
      } while (
        (rowGridOffset === 0 && rowOffset < 0) ||
        (columnGridOffset === 0 && columnOffset < 0) ||
        (rowGridOffset === deckGrid.row - 1 && rowOffset > 0) ||
        (columnGridOffset === deckGrid.column - 1 && columnOffset > 0)
      )

      // 根据网格偏移与卡牌内偏移计算随机后的卡牌位置
      currentCard.pos = {
        x: deckBoxPos.left + rowGridOffset * card.width + rowOffset,
        y: deckBoxPos.top + columnGridOffset * card.height + columnOffset
      }
    },
    /**
     * 计算牌堆中剩余卡牌覆盖情况
     * @param state 
     */
    checkCardCover(state){
      for(let i=0; i<state.deck.length; i++){
        // 默认所有卡牌初始状态为未覆盖
        state.deck[i].isCover = false
        for(let j=i+1; j<state.deck.length; j++){
          /**
           * 前提：卡牌通过数组v-for渲染，数组排序在后的卡牌，dom顺序也在后，
           * dom顺序在后的元素会覆盖在前的元素。
           * 规则：当前卡牌只与其牌堆数组内顺序之后的卡牌比较，因为只有顺序之后的卡牌才可能覆盖它；
           * 只要找到其中一个之后的卡牌与其相交，则卡牌会被覆盖，不需要再继续比较。
           */
          if(isIntersect(state.deck[i].pos, state.deck[j].pos)){
            state.deck[i].isCover = true
            break
          }
        }
      }
      
      /**
       * 检查两个卡牌是否相交
       * @param {Object} pos1 当前被检查是否被覆盖的卡牌
       * @param {number} pos1.x 
       * @param {number} pos1.y 
       * @param {Object} pos2 当前被检查卡牌顺序之后的卡牌
       * @param {number} pos2.x 
       * @param {number} pos2.y 
       * @returns Boolean 是否被覆盖，true - 是，false - 否
       */
      function isIntersect(pos1, pos2){
        const { card } = state.options
        // 两卡牌的 x 与 y 左边之差 都小于 卡牌的宽与高，则卡牌相交
        return Math.abs(pos1.x - pos2.x) < card.width && Math.abs(pos1.y - pos2.y) < card.height
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

      // 卡牌位置移动到缓存堆
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
    /**
     * 设置道具数量
     * @param state 
     * @param prop 道具prop名
     * @param num 道具数量
     */
    setItemCount(state, { prop, value }) {
      if(state.items[prop] === undefined) return
      state.items[prop] = value
    },
    /**
     * 锁定或解锁游戏画面，防止用户继续进行操作
     * @param state 
     * @param isLocked 锁定状态
     */
    lockGame(state, isLocked=true){
      state.gameLocked = isLocked
    }
  },
  actions: {
    /**
     * 初始化游戏
     * @param context 
     */
    async initGame({ state, commit }) {
      commit('lockGame', true)
      commit('initCardData')
      // 重置道具数量
      commit('setItemCount', {prop: 'refresh', value: 1})
      commit('setItemCount', {prop: 'back', value: 1})
      // 随机生成卡牌位置
      for(let i=0; i<state.deck.length; i++){
        await delay(10)
        commit('randomCardPos', state.deck[i])
      }
      // 计算牌堆内卡牌覆盖关系
      await delay(300)
      commit('checkCardCover')
      commit('lockGame', false)
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
      // 计算牌堆内卡牌覆盖关系
      await delay(300)
      commit('checkCardCover')

      // 在缓存堆中寻找与当前卡牌code值相同的卡牌
      const targets = state.cache.filter(item => item.code === currentCard.code)
      // 如果该卡牌在缓存堆中的数量达到 设置中的消除数
      if (targets.length === state.options.group.removeCount) {
        // 获取所有缓存堆中将要消除的相同卡牌
        const sameCards = state.cache.filter(item => item.code === currentCard.code)
        // 先执行缓存堆中的卡牌消除，以防止在动画执行过程中继续添加卡牌导致游戏结束
        commit('removeSameCardInCache', sameCards)
        sameCards.forEach(item => (item.disappearing = true))
        // 消除动画执行结束后，从总卡牌数据中消除卡牌
        setTimeout(() => {
          commit('removeSameCardInAll', sameCards)
          // 重新计算缓存堆中剩余卡牌的坐标
          commit('rerenderCacheBox')
          // 总卡牌数量为0，游戏胜利
          if (state.allCards.length === 0) {
            alert('游戏胜利，恭喜你')
            dispatch('initGame')
            return 
          }
        }, 310)
      } else {
        // 缓存堆卡牌达到数量上限且无法消除卡牌，则游戏结束
        if(state.cache.length === state.options.cacheMax) {
          setTimeout(() => {
            alert('游戏结束，点击确定重新开始')
            dispatch('initGame')
            return 
          }, 310);
        }
      }
    },
    /**
     * 将缓存堆中的所有卡牌重新移入牌堆中
     * @param state 
     */
    async moveAllToDeck({ state, commit }){
      commit('lockGame', true)
      // 移除缓存堆中的所有卡牌
      const toDeckCards = state.cache.splice(0, state.cache.length)
      // 将从缓存堆中移除的卡牌加入牌堆中
      state.deck.push(...toDeckCards)
      state.deck = _.intersection(state.allCards, state.deck)
      // 将移除的卡牌，重新生成其在牌堆中的坐标
      toDeckCards.forEach(item => {
        commit('randomCardPos', item)
        // 设置缓存状态为false
        item.cached = false
      })
      // 计算牌堆内卡牌覆盖关系
      await delay(300)
      commit('checkCardCover')
      commit('lockGame', false)
    },
    /**
     * 重新排列牌堆中的卡牌
     * @param state 
     */
    async refreshDeck({ state, commit}){
      commit('lockGame', true)
      // 重新随机生成牌堆中所有卡牌的坐标
      for(let i=0; i<state.deck.length; i++){
        await delay(10)
        state.deck[i].pos = state.boxConfig.deckBoxCenter
        state.deck[i].isCover = false
      }
      // 重新随机生成牌堆中所有卡牌的坐标
      for(let i=0; i<state.deck.length; i++){
        await delay(10)
        commit('randomCardPos', state.deck[i])
      }
      // 计算牌堆内卡牌覆盖关系
      await delay(300)
      commit('checkCardCover')
      commit('lockGame', false)
    },
  },
  modules: {},
})
