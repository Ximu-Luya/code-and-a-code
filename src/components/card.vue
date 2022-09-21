<template>
  <div
    class="card-item layout-center box-shadow"
    :class="{ 'animate__animated animate__bounceOut': cardData.disappearing}"
    @click="handleClick"
    :style="position"
  >
    <div class="content"> {{cardData.code}} </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: ["cardData"],
  data(){
    return {
      cached: false
    }
  },
  computed: {
    position(){
      return {
        left: `${this.cardData.pos.x}px`,
        top: `${this.cardData.pos.y}px`,
      }
    }
  },
  methods: {
    ...mapActions(['saveInCache']),
    handleClick(){
      if (this.cardData.cached) return null

      this.saveInCache(this.cardData)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-item{
  position: absolute;
  width: 50px;
  height: 60px;

  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;

  transition: .3s;
  z-index: 2;

  // 卡片阴影
  &.box-shadow {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }

  // 卡片内部布局
  &.layout-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content {
    text-align: center;
  }
}
</style>