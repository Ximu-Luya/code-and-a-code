<template>
  <div class="home">
    <img class="title" src="/static/title.png">

    <div class="start-game home-button" @click="startGame">开始游戏</div>
    <div class="change-log home-button" @click="openChangeLog">更新日志</div>
    <div class="error-log home-button" @click="openErrorLog">错误日志</div>

    <change-log v-model:visible="changeLogVisible"></change-log>
    <error-log v-model:visible="errorLogVisible"></error-log>

    <div class="copyright">
      Developed by <el-link href="https://github.com/Ximu-Luya" target="_blank">@Ximu-Luya</el-link> 
      Ver {{version}}
    </div>
  </div>
</template>

<script>
import packageConfig from "@/../package.json"
import ChangeLog from '@/components/changeLog.vue';
import ErrorLog from "@/components/errorLog.vue";
export default {
  components: {
    ChangeLog,
    ErrorLog
},
  data(){
    return {
      version: packageConfig.version,
      changeLogVisible: false,
      errorLogVisible: false
    }
  },
  methods: {
    startGame(){
      this.$router.push('/game')
    },
    openChangeLog(){
      this.changeLogVisible = true
    },
    openErrorLog(){
      this.errorLogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    width: 60%;
    margin-bottom: 100px;
  }
  .home-button {
    position: relative;
    width: 35%;
    max-width: 360px;
    padding: 15px 20px;
    line-height: 24px;
    text-align: center;
    border-radius: 5px;
    color: #fff;
    font-size: 20px;
    margin-bottom: 20px;
    font-weight: bold;

    &:active{
      top: 8px;
      box-shadow: 0 1px 6px rgb(0 0 0 / 20%) inset;
    }
  }
  .start-game {
    border: 1px solid #9bcf60;
    box-shadow: 0 0 0 1px #469a44, 1px 5px 0 #469a44, -1px 5px 0 #469a44, 0 6px 8px rgb(0 0 0 / 80%);
    background: -webkit-linear-gradient(top,#8dd845,#6fbb31);
    &:active {
      background: -webkit-linear-gradient(top,#6fbb31,#6fbb31);
    }
  }
  .change-log {
    border: 1px solid #e5bf76;
    box-shadow: 0 0 0 1px #88683b, 1px 5px 0 #88683b, -1px 5px 0 #88683b, 0 6px 8px rgb(0 0 0 / 80%);
    background: -webkit-linear-gradient(top,#e0b956,#bb8231);
    &:active {
      background: -webkit-linear-gradient(top,#bb8231,#bb8231);
    }
  }
  .error-log {
    border: 1px solid #ef8585;
    box-shadow: 0 0 0 1px #c45656, 1px 5px 0 #c45656, -1px 5px 0 #c45656, 0 6px 8px rgb(0 0 0 / 80%);
    background: -webkit-linear-gradient(top,#ef8585, #F56C6C);
    &:active {
      background: -webkit-linear-gradient(top,#F56C6C,#F56C6C);
    }
  }

  .copyright {
    position: absolute;
    right: 0; bottom: 0;
    padding: 20px;
    display: flex;
    align-items: center;

    >* {
      padding: 0 5px;
    }
  }
}
</style>