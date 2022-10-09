<template>
  <div class="top-nav">
    <el-page-header @back="handleBack">
      <template #content>
        <span class="text-large font-600 mr-3"> {{ title }} </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <slot name="extra"></slot>
        </div>
      </template>
    </el-page-header>
  </div>
</template>

<script>
export default {
  props: ['title'],
  methods: {
    handleBack() {
      this.$router.replace('/home')
    },
  },
}
</script>

<style lang="scss" scoped>
.top-nav {
  width: 100%;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;

  >* {
    flex-grow: 1;
  }
}
</style>
<style>
/* 去除导航栏面包屑的默认margin */
.el-page-header__breadcrumb {
  margin: 0 !important;
}
</style>
