<template>
  <Dialog :visible="visible" @update:visible="visible = $event" title="更新日志">
    <article class="markdown-body">
      <div
        v-for="logItem in ChangeLogData"
        :key="logItem.update"
        class="change-log-item"
      >
        <h2>{{ logItem.version }} ({{ logItem.update }})</h2>
        <template v-for="changeItem in logItem.changes">
          <h3>{{changeItem.type}}</h3>
          <ul>
            <li v-for="contentItem in changeItem.content">
              <strong>{{contentItem.title}}: </strong>
              {{contentItem.description}}
            </li>
          </ul>
        </template>
      </div>
    </article>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue'
import ChangeLogData from '@/assets/changelog.json'

const visible = defineModel<boolean>('visible', { required: true })
</script>

<style lang="scss" scoped>
.markdown-body {
  h2 {
    margin-top: 0 !important;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    padding-bottom: 0.3em;
    font-size: 1.5em;
    border-bottom: 1px solid hsla(210,18%,87%,1);;
  }

  h3 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    font-size: 1.25em;
  }
}
</style>