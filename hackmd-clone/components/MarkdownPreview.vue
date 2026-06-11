<template>
  <div class="preview-container">
    <div class="preview-header">
      <span class="preview-title">预览</span>
    </div>
    <div class="preview-content markdown-body" v-html="renderedContent"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

const renderedContent = ref('')

async function renderMarkdown(content: string) {
  if (!process.client) return
  const { marked } = await import('marked')
  renderedContent.value = marked(content || '', {
    breaks: true,
    gfm: true
  })
}

watch(() => props.content, (newContent) => {
  renderMarkdown(newContent)
}, { immediate: true })
</script>

<style scoped>
.preview-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.preview-header {
  padding: 10px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  flex-shrink: 0;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}
</style>
