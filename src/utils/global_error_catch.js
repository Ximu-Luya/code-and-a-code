import dayjs from 'dayjs'

// 全局错误捕获
function globalErrorHandle(msg,url,l,c,error) {
  console.error("全局错误捕获已处理：\n", msg);
  errorCache(error)
}

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

window.onerror = globalErrorHandle;
window.errorCache = errorCache