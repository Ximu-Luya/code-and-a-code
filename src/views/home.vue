<template>
  <div class="home">
    <card v-for="item in 4" :key="item"></card>
  </div>
</template>

<script>
import Card from '@/components/card.vue'
export default {
  components: {
    Card
  },
  data(){
    return {

    }
  }
}
</script>
