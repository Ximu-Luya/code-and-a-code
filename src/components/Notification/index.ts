import { createVNode, render } from 'vue'
import NotificationComponent from './Notification.vue'
import type { NotificationProps } from './Notification.vue'

const notificationInstances: Set<HTMLElement> = new Set()

interface NotificationOptions extends NotificationProps {
  content: string
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  showClose?: boolean
  duration?: number
  onClose?: () => void
}

function Notification(options: NotificationOptions) {
  const container = document.createElement('div')
  
  const vnode = createVNode(NotificationComponent, {
    ...options,
    onClose: () => {
      options.onClose?.()
      setTimeout(() => {
        render(null, container)
        document.body.removeChild(container)
        notificationInstances.delete(container)
      }, 300)
    }
  })
  
  render(vnode, container)
  document.body.appendChild(container)
  notificationInstances.add(container)
}

// 为 Notification 添加类型方法
Notification.success = (content: string, options: Partial<NotificationOptions> = {}) => {
  return Notification({ content, type: 'success', ...options })
}

Notification.warning = (content: string, options: Partial<NotificationOptions> = {}) => {
  return Notification({ content, type: 'warning', ...options })
}

Notification.error = (content: string, options: Partial<NotificationOptions> = {}) => {
  return Notification({ content, type: 'error', ...options })
}

Notification.info = (content: string, options: Partial<NotificationOptions> = {}) => {
  return Notification({ content, type: 'info', ...options })
}

export { Notification } 