<template>
  <div class="page">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url("@/main.scss");
#app {
  font-family: Microsoft YaHei, Helvetica, Arial, sans-serif;
  background-color: #f7f7f7;
}
.page {
  margin: 0 auto 0 auto;
  max-width: 600px;
  height: 100vh;
  width: 100vw;
  background-color: white;
  box-shadow: 0 0 12px 0 rgb(0 0 0 / 10%);
}
</style>
