<template>
  <div class="top-nav">
    <el-page-header @back="handleBack">
      <template #content>
        <span class="text-large font-600 mr-3"> {{ title }} </span>
      </template>
    </el-page-header>
  </div>
</template>

<script>
export default {
  props: ['title'],
  methods: {
    handleBack() {
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.top-nav {
  width: 100%;
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}
</style>
<style>
/* 去除导航栏面包屑的默认margin */
.el-page-header__breadcrumb {
  margin: 0 !important;
}
</style>
