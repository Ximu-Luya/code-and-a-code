import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'

// 错误缓存
function errorCache(error) {
  const errorTime = new dayjs().format('YYYY-MM-DD HH:mm:ss') 
  const newErrorToReport = {time: errorTime, message: error.message, stack: error.stack}
  // 获取本地未上报错误列表并加入新的错误
  const errorNotReport = JSON.parse(localStorage.getItem("errorNotReport")) || []
  errorNotReport.push(newErrorToReport)
  // 若上报失败，将累积错误列表存入localStorage中
  localStorage.setItem("errorNotReport", JSON.stringify(errorNotReport))
}

// 全局错误捕获
export function globalErrorHandle(msg, error) {
  console.error("全局错误捕获已处理：\n", msg);
  ElNotification({
    title: '全局错误捕获',
    message: '模块已捕获到错误，游戏进程可能受到影响，请刷新页面重新游戏，并联系开发者',
    duration: 0,
    type: 'warning',
  })
  errorCache(error)
}