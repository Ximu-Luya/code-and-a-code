<template>
  <div class="page" @click="handleGlobalClick">
    <router-view/>
  </div>
</template>

<script>
export default {
  methods: {
    handleGlobalClick(){
      if(window.navigator) {
        window.navigator.vibrate(20)
      }
    }
  }
}
</script>

<style lang="scss">
@import url("@/main.scss");
@import url("animate.css");
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background-color: #f7f7f7;
}
</style>

<style lang="scss" scoped>
.page {
  margin: 0 auto 0 auto;
  max-width: 600px;
  height: 100vh;
  width: 100vw;
  background-color: white;
  box-shadow: 0 0 12px 0 rgb(0 0 0 / 10%);
}
</style>