<template>
  <div
    class="card-item layout-center box-shadow"
    :class="{
      'animate__animated animate__bounceOut': cardData.disappearing,
      'border': !cardData.isCover
    }"
    @click="handleClick"
    :style="style"
  >
    <div class="content">
      <div class="img-box">
        <img
          :src="CardIcon.FrontEnd[cardData.code].src"
          :alt="cardData.code"
          draggable="false"
        >
      </div>
      <div class="name">{{CardIcon.FrontEnd[cardData.code].name}}</div>
    </div>
    <div class="mask" v-if="cardData.isCover"></div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CardIcon from '@/assets/card.icon.json'
export default {
  props: ["cardData"],
  data(){
    return {
      cached: false,
      CardIcon: CardIcon
    }
  },
  computed: {
    ...mapState(['options']),
    style(){
      return {
        translate: `${this.cardData.pos.x}px ${this.cardData.pos.y}px`,
        width: `${this.options.card.width}px`,
        height: `${this.options.card.height}px`
      }
    },
  },
  methods: {
    ...mapActions(['saveInCache']),
    handleClick(){
      if (this.cardData.cached) return null
      if (this.cardData.isCover) return null

      this.saveInCache(this.cardData)
    },
  }
}
</script>

<style lang="scss" scoped>
.card-item{
  position: absolute;
  // translate原点
  left: 0; top: 0;

  border-radius: 4px;
  background-color: #fff;

  transition: .3s;
  z-index: 2;

  // 卡片阴影
  &.box-shadow {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }

  &.border {
    border: 1px solid #ebeef5;
  }

  // 卡片内部布局
  &.layout-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content {
    font-size: 14px;
    width: 100%;
    height: 100%;
    position: relative;

    .img-box {
      position: absolute;
      top: 5px; bottom: 20px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: scale-down;
      }
    }

    .name {
      position: absolute;
      text-align: center;
      bottom: 3px;
      width: 100%;
      line-height: 16px;
      height: 16px;
    }
  }

  // 卡牌被覆盖的遮罩
  .mask{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0; top: 0;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>