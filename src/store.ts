import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  random,
  slice,
  shuffle,
  sampleSize,
  range,
  flatMapDeep,
  clamp,
  intersection
} from 'lodash'
import CardIconData from '@/assets/cardicons.json'

type Pos = {
  x: number
  y: number
}

type BoxPos = {
  top: number
  bottom: number
  left: number
  right: number
}

export type Card = {
  id: string
  code: number
  pos: Pos
  isCovered: boolean
  isCached: boolean
  isDisappearing: boolean
}

export const useGameStore = defineStore('game', () => {
  const gameSeed = ref<number>()
  const allCards = ref<Card[]>([])
  const deck = ref<Card[]>([])
  const cache = ref<Card[]>([])
  const gameLocked = ref(false)
  const gameContainerPos = ref({
    // 牌堆四边位置
    deckBoxPos: { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 },
    // 缓存区坐标
    cacheBoxPos: { x: 0, y: 0 },
    // 牌堆中央坐标
    deckBoxCenter: { x: 0, y: 0 },
    // 牌堆网格信息
    deckGrid: { row: 0, column: 0 }
  })
  const gameOptions = ref<{
    card: { width: number, height: number }
    cacheMax: number
    group: {
      name: 'FrontEnd'
      removeCount: number
      rmCountMultiple: number
    }
  }>({
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
      rmCountMultiple: 2
    }
  })

  /**
   * 延时方法
   * @param {Number} time 延时时间，单位ms
   */
  const delay = (time: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  /**
   * 生成游戏种子
   * @returns 时间戳种子
   */
  const seedGenerate = () => {
    return Date.now()
  }

  /**
   * 根据百分比概率生成结果（true or false）
   * @param {Number} percentage 概率（百分比）
   * @returns Boolean 根据概率生成的结果
   */
  const probabilityGenerate = (percentage: number) => {
    // 概率大于100%，恒真
    if (percentage > 100) return true
    // 概率小于0%，恒假
    if (percentage <= 0) return false

    return random(1, 100) <= percentage
  }

  /**
   * 设置卡牌大小
   * @param state
   * @param size 卡牌尺寸
   */
  const setCardSize = (size: number) => {
    gameOptions.value.card = { width: size, height: size }
  }
  /**
   * 初始化页面容器坐标
   * @param pos 牌堆与缓存堆坐标
   * @param pos.deckBoxPos 牌堆四边坐标
   * @param pos.cacheBoxPos 缓存堆坐标
   */
  const initBoxPos = ({ deckBoxPos, cacheBoxPos }: {
    deckBoxPos: BoxPos
    cacheBoxPos: Pos
  }) => {
    const { card } = gameOptions.value

    // 以卡牌长宽为一个方格，计算整数个方格划分牌堆后的实际牌堆偏移量
    let deckHorizontalOffset, deckVerticalOffset
    deckHorizontalOffset = ((deckBoxPos.right - deckBoxPos.left) % card.width) / 2
    deckVerticalOffset = ((deckBoxPos.bottom - deckBoxPos.top) % card.height) / 2

    // 如果水平与垂直方向长度大于 8个网格，限制网格为最大8个计算偏移量
    if (deckBoxPos.right - deckBoxPos.left - card.width * 8 > 0) {
      deckHorizontalOffset = (deckBoxPos.right - deckBoxPos.left - card.width * 8) / 2
    }
    if (deckBoxPos.bottom - deckBoxPos.top - card.height * 8 > 0) {
      deckVerticalOffset = (deckBoxPos.bottom - deckBoxPos.top - card.height * 8) / 2
    }

    // 计算网格化后的实际的牌堆尺寸
    const realDeckPos = {
      top: deckBoxPos.top + deckVerticalOffset,
      bottom: deckBoxPos.bottom - deckVerticalOffset,
      left: deckBoxPos.left + deckHorizontalOffset,
      right: deckBoxPos.right - deckHorizontalOffset,
      width: 0,
      height: 0
    }
    // 牌堆长宽参数
    realDeckPos.width = realDeckPos.right - realDeckPos.left
    realDeckPos.height = realDeckPos.bottom - realDeckPos.top

    gameContainerPos.value.deckBoxPos = realDeckPos

    // 牌堆网格参数
    gameContainerPos.value.deckGrid.row = realDeckPos.width / card.width
    gameContainerPos.value.deckGrid.column = realDeckPos.height / card.height

    // 缓存堆坐标
    gameContainerPos.value.cacheBoxPos.x = cacheBoxPos.x
    gameContainerPos.value.cacheBoxPos.y = cacheBoxPos.y

    // 牌堆中央坐标
    gameContainerPos.value.deckBoxCenter = {
      x: realDeckPos.left + (realDeckPos.right - realDeckPos.left - card.width) / 2,
      y: realDeckPos.top + (realDeckPos.bottom - realDeckPos.top - card.height) / 2
    }
  }

  /**
   * 初始化牌堆
   */
  const initCardData = () => {
    const { group } = gameOptions.value
    // 卡牌组数 = 卡牌Icon数组长度
    const groupCount = CardIconData[group.name].length
    // 初始化元数据、牌堆、缓存堆
    allCards.value = []
    deck.value = []
    cache.value = []
    // 卡牌初始在牌堆中央
    const deckBoxCenter = gameContainerPos.value.deckBoxCenter
    let allCardsData = []

    // 随机 1/3 卡牌为卡牌数较少的稀有卡牌
    const rareCodes = sampleSize(range(groupCount), groupCount / 3)
    for (let cardCode = 0, id = 0; cardCode < groupCount; cardCode++) {
      // 每组卡牌数 = 卡牌消除数 * 消除数倍数(4组卡牌6张，8组卡牌15张)
      const perGroup = rareCodes.includes(cardCode) ? 2 * group.removeCount : 5 * group.removeCount
      for (let cardCount = 0; cardCount < perGroup; cardCount++) {
        allCardsData.push({
          id: `${gameSeed.value}-${id++}`,
          code: cardCode,
          pos: {
            x: deckBoxCenter.x,
            y: deckBoxCenter.y
          },
          isDisappearing: false,
          isCovered: false,
          isCached: false
        })
      }
    }

    /**
     * 打乱数组前 2/3 的卡牌顺序
     * 即打乱底部最后 2/3 的卡牌顺序
     * 游戏进程的前 1/3 卡牌维持顺序保证游戏进程前半部分顺畅
     */
    allCardsData = [
      slice(allCardsData, 0, allCardsData.length * 5 / 6),
      slice(allCardsData, allCardsData.length * 5 / 6)
    ]
    allCardsData[0] = shuffle(allCardsData[0])
    allCards.value = flatMapDeep(allCardsData)

    // 防止难度过低，暂时全部打乱
    // allCards = _.shuffle(allCards)
    // 所有卡牌初始在牌堆中
    deck.value = allCards.value
  }
  /**
   * 随机设置卡牌位置
   */
  const randomCardPos = (currentCard: Card) => {
    const { deckGrid, deckBoxPos } = gameContainerPos.value
    const { card } = gameOptions.value

    // 生成网格偏移
    function generateGridOffset(max_grid: number) {
      const center = [Math.floor(max_grid / 2 - max_grid * 1 / 6), Math.ceil(max_grid / 2 + max_grid * 1 / 6)]

      // 剩余100卡牌开始，生成卡牌位置在牌堆中间的概率提升
      const percentage = clamp(150 - deck.value.length, 50, 100)
      if (probabilityGenerate(percentage)) {
        return random(center[0], center[1])
      } else {
        return random(0, max_grid)
      }
    }
    // 随机水平与垂直网格偏移
    const rowGridOffset = generateGridOffset(deckGrid.row - 1)
    const columnGridOffset = generateGridOffset(deckGrid.column - 1)
    // 随机水平与垂直卡牌内偏移
    let rowOffset, columnOffset
    do {
      rowOffset = random(-1, 1) * card.width / 2
      columnOffset = random(-1, 1) * card.height / 2
    } while (
      (rowGridOffset === 0 && rowOffset < 0)
      || (columnGridOffset === 0 && columnOffset < 0)
      || (rowGridOffset === deckGrid.row - 1 && rowOffset > 0)
      || (columnGridOffset === deckGrid.column - 1 && columnOffset > 0)
    )

    // 根据网格偏移与卡牌内偏移计算随机后的卡牌位置
    currentCard.pos = {
      x: deckBoxPos.left + rowGridOffset * card.width + rowOffset,
      y: deckBoxPos.top + columnGridOffset * card.height + columnOffset
    }
  }

  /**
   * 计算牌堆中剩余卡牌覆盖情况
   */
  const checkCardCover = () => {
    for (let i = 0; i < deck.value.length; i++) {
      // 默认所有卡牌初始状态为未覆盖
      deck.value[i].isCovered = false
      for (let j = i + 1; j < deck.value.length; j++) {
        /**
         * 前提：卡牌通过数组v-for渲染，数组排序在后的卡牌，dom顺序也在后，
         * dom顺序在后的元素会覆盖在前的元素。
         * 规则：当前卡牌只与其牌堆数组内顺序之后的卡牌比较，因为只有顺序之后的卡牌才可能覆盖它；
         * 只要找到其中一个之后的卡牌与其相交，则卡牌会被覆盖，不需要再继续比较。
         */
        if (isIntersect(deck.value[i].pos, deck.value[j].pos)) {
          deck.value[i].isCovered = true
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
    function isIntersect(pos1: Pos, pos2: Pos) {
      const { card } = gameOptions.value
      // 两卡牌的 x 与 y 左边之差 都小于 卡牌的宽与高，则卡牌相交
      return Math.abs(pos1.x - pos2.x) < card.width && Math.abs(pos1.y - pos2.y) < card.height
    }
  }

  /**
   * 卡牌从牌堆移入缓存堆
   * @param currentCard 卡牌数据
   */
  const moveToCache = (currentCard: Card) => {
    const target = deck.value.findIndex(item => item.id === currentCard.id)
    if (target < 0) return alert('该卡牌不存在')

    deck.value = deck.value.filter(item => item.id !== currentCard.id)
    cache.value.push(currentCard)
    // 设置缓存状态为true，使其不可继续点击
    currentCard.isCached = true

    // 卡牌位置移动到缓存堆
    currentCard.pos = {
      x: gameContainerPos.value.cacheBoxPos.x + (cache.value.length - 1) * gameOptions.value.card.width,
      y: gameContainerPos.value.cacheBoxPos.y
    }
  }

  /**
   * 消除缓存堆中Code相同的卡牌
   * @param sameCards 将要消除的卡牌数组
   */
  const removeSameCardInCache = (sameCards: Card[]) => {
    cache.value = cache.value.filter(item => {
      return !sameCards.some(sameCard => sameCard.id === item.id)
    })
  }

  /**
   * 消除总卡牌数据中Code相同的卡牌
   * @param state
   * @param sameCards 将要消除的卡牌数组
   */
  const removeSameCardInAll = (sameCards: Card[]) => {
    allCards.value = allCards.value.filter(item => {
      return !sameCards.some(sameCard => sameCard.id === item.id)
    })
  }

  /**
   * 重新计算缓存堆中卡牌的坐标
   * @param state
   */
  const rerenderCacheBox = () => {
    cache.value.forEach((item, index) => {
      item.pos.x = gameContainerPos.value.cacheBoxPos.x + index * gameOptions.value.card.width
    })
  }

  /**
   * 锁定或解锁游戏画面，防止用户继续进行操作
   * @param isLocked 锁定状态
   */
  const lockGame = (isLocked = true) => {
    gameLocked.value = isLocked
  }

  return {
    gameSeed,
    allCards,
    deck,
    cache,
    gameLocked,
    gameContainerPos,
    gameOptions,
    /**
     * 初始化游戏
     * @param seed 游戏种子
     */
    async initGame(seed: number = seedGenerate()) {
      gameSeed.value = seed
      lockGame(true)
      initCardData()
      // 随机生成卡牌位置
      for (let i = 0; i < deck.value.length; i++) {
        await delay(10)
        randomCardPos(deck.value[i])
      }
      // 计算牌堆内卡牌覆盖关系
      await delay(100)
      checkCardCover()
      lockGame(false)
    },
    /**
     * 点击卡牌，移入缓存堆，进行后续决策
     * @param currentCard 当前点击的卡牌
     */
    async saveInCache(currentCard: Card) {
      // 缓存堆达到数量上限时，不允许继续添加卡牌
      if (cache.value.length === gameOptions.value.cacheMax) return
      // 卡牌移入缓存堆
      moveToCache(currentCard)
      // 计算牌堆内卡牌覆盖关系
      setTimeout(() => checkCardCover(), 300)

      // 在缓存堆中寻找与当前卡牌code值相同的卡牌
      const targets = cache.value.filter(item => item.code === currentCard.code)
      // 如果该卡牌在缓存堆中的数量达到 设置中的消除数
      if (targets.length === gameOptions.value.group.removeCount) {
        console.log('消除卡牌')
        // 获取所有缓存堆中将要消除的相同卡牌
        const sameCards = cache.value.filter(item => item.code === currentCard.code)
        // 先执行缓存堆中的卡牌消除，以防止在动画执行过程中继续添加卡牌导致游戏结束
        removeSameCardInCache(sameCards)
        setTimeout(() => {
          sameCards.forEach(item => (item.isDisappearing = true))
        }, 300)
        // 消除动画执行结束后，从总卡牌数据中消除卡牌
        setTimeout(() => {
          removeSameCardInAll(sameCards)
          // 重新计算缓存堆中剩余卡牌的坐标
          rerenderCacheBox()
          // 总卡牌数量为0，游戏胜利
          if (allCards.value.length === 0) {
            alert('游戏胜利，恭喜你')
            return
          }
        }, 600)
      } else {
        // 缓存堆卡牌达到数量上限且无法消除卡牌，则游戏结束
        if (cache.value.length === gameOptions.value.cacheMax) {
          setTimeout(() => {
            alert('游戏结束，点击确定重新开始')
            return
          }, 310)
        }
      }
    },
    /**
     * 将缓存堆中的所有卡牌重新移入牌堆中
     */
    async moveAllToDeck() {
      lockGame(true)
      // 移除缓存堆中的所有卡牌
      const toDeckCards = cache.value.splice(0, cache.value.length)
      // 将从缓存堆中移除的卡牌加入牌堆中
      deck.value.push(...toDeckCards)
      deck.value = intersection(allCards.value, deck.value)
      // 将移除的卡牌，重新生成其在牌堆中的坐标
      toDeckCards.forEach(card => {
        randomCardPos(card)
        // 设置缓存状态为false
        card.isCached = false
      })
      // 计算牌堆内卡牌覆盖关系
      await delay(300)
      checkCardCover()
      lockGame(false)
    },
    /**
     * 重新排列牌堆中的卡牌
     * @param state
     */
    async refreshDeck() {
      lockGame(true)
      // 重新随机生成牌堆中所有卡牌的坐标
      for (let i = 0; i < deck.value.length; i++) {
        await delay(10)
        deck.value[i].pos = gameContainerPos.value.deckBoxCenter
        deck.value[i].isCovered = false
      }
      // 重新随机生成牌堆中所有卡牌的坐标
      for (let i = 0; i < deck.value.length; i++) {
        await delay(10)
        randomCardPos(deck.value[i])
      }
      // 计算牌堆内卡牌覆盖关系
      await delay(300)
      checkCardCover()
      lockGame(false)
    },
    setCardSize,
    initBoxPos
  }
})
