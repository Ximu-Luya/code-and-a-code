<template>
  <div
    class="card-item layout-center box-shadow"
    @click="handleClick"
    :style="position"
  >
    <!-- <img src="https://bpic.51yuansu.com/pic2/cover/00/43/53/5812dc60762fe_610.jpg?x-oss-process=image/sharpen,100" /> -->
    <div class="content"> {{cardData.code}} </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
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
    ...mapMutations(['moveToCache']),
    handleClick(){
      if (this.cached) return null

      this.moveToCache(this.cardData.id)
      this.cached = true
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