<template>
  <xm-dialog
    :visible="visible"
    title="道具使用"
    @close="$emit('update:visible', false)"
    height="400px"
  >
    <div class="item-dialog-box">
      <el-image></el-image>
      <div class="owned-count"> 当前拥有： {{count}} 个</div>
      <div class="description"> {{itemData.description}} </div>
      <el-button @click="getItem">获得一个</el-button>
      <el-button @click="useItem">使用一个</el-button>
    </div>
  </xm-dialog>
</template>

<script>
import { ElMessage, ElNotification } from 'element-plus'
import { mapMutations, mapState, mapActions } from 'vuex';
import XmDialog from "./dialog.vue"
export default {
  components: {
    XmDialog
  },
  emits: ['update:visible'],
  props: ['visible', 'itemData'],
  data() {
    return {
      
    }
  },
  computed: mapState({
    count(state) {
      return state.items[this.itemData.prop]
    }
  }),
  methods: {
    ...mapMutations(['setItemCount']),
    ...mapActions(['moveAllToDeck', 'refreshDeck']),
    getItem(){
      ElMessage({message: '开发中', type: 'warning'})
    },
    useItem(){
      if(this.count == 0) {
        ElNotification({
          title: '道具使用失败',
          message: '道具剩余数量不够啦',
          duration: 2000,
          type: 'warning',
        })
        return null
      }

      // 道具名与其功能方法映射
      const operation = {
        'refresh': 'refreshDeck',
        'back': 'moveAllToDeck'
      }
      // 扣除道具数量
      this.setItemCount({prop: this.itemData.prop, value: this.count-1})
      // 执行道具对应功能
      this[operation[this.itemData.prop]]()
      ElMessage({
        message: '道具使用成功',
        type: 'success',
      })
      // 关闭道具对话框
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.item-dialog-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-button+.el-button{
    margin: 0;
  }

  >* {
    margin-bottom: 10px;
  }
}
</style>