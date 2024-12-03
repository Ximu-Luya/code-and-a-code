import { createVNode, render } from 'vue'
import MessageComponent from './Message.vue'
import type { MessageProps } from './Message.vue'

const messageInstances: Set<HTMLElement> = new Set()

interface MessageOptions extends MessageProps {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  showClose?: boolean
  duration?: number
  onClose?: () => void
}

function Message(options: MessageOptions | string) {
  const props = typeof options === 'string' 
    ? { message: options } 
    : options

  const container = document.createElement('div')
  
  const vnode = createVNode(MessageComponent, {
    ...props,
    onClose: () => {
      props.onClose?.()
      setTimeout(() => {
        render(null, container)
        document.body.removeChild(container)
        messageInstances.delete(container)
      }, 300)
    }
  })
  
  render(vnode, container)
  document.body.appendChild(container)
  messageInstances.add(container)
}

// 为 Message 添加类型方法
Message.success = (message: string, options: Partial<MessageOptions> = {}) => {
  return Message({ message, type: 'success', ...options })
}

Message.warning = (message: string, options: Partial<MessageOptions> = {}) => {
  return Message({ message, type: 'warning', ...options })
}

Message.error = (message: string, options: Partial<MessageOptions> = {}) => {
  return Message({ message, type: 'error', ...options })
}

Message.info = (message: string, options: Partial<MessageOptions> = {}) => {
  return Message({ message, type: 'info', ...options })
}

export { Message }
