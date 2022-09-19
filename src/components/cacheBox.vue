<template>
</template>

<script>
import { mapState } from 'vuex';
import card from './card.vue';
export default {
  components: { card },
  computed: {
    ...mapState(['cache'])
  }
}
</script>

<style lang="scss" scoped>
</style>