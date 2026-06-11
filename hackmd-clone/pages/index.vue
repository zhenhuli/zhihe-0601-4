<template>
  <div class="app-container">
    <DocumentSidebar />
    
    <div class="main-area">
      <div class="editor-header">
        <div class="header-left">
          <h1 class="doc-title-display">
            {{ currentDocument?.title || '未选择文档' }}
          </h1>
          <span class="save-status" :class="{ saved: isSaved }">
            {{ isSaved ? '已保存' : '保存中...' }}
          </span>
          <span v-if="currentDocument" class="version-badge">
            v{{ documentVersion }}
          </span>
        </div>
        <div class="header-right">
          <div v-if="onlineUsers.length > 0" class="online-users">
            <span class="online-label">在线:</span>
            <div
              v-for="user in onlineUsers"
              :key="user.userId"
              class="user-avatar"
              :style="{ backgroundColor: user.color }"
              :title="user.userId"
            >
              {{ user.userId.slice(-2).toUpperCase() }}
            </div>
          </div>
          <button
            v-if="currentDocument"
            class="btn-history"
            @click="showHistory = !showHistory"
            :class="{ active: showHistory }"
          >
            📜 历史
          </button>
          <span v-if="!wsEnabled" class="connection-status disabled">
            ○ 实时协作不可用
          </span>
          <span v-else-if="connected" class="connection-status connected">
            ● 实时协作已连接
          </span>
          <span v-else class="connection-status disconnected">
            ○ 连接中...
          </span>
        </div>
      </div>

      <div class="editor-preview-area">
        <div class="editor-pane">
          <div class="pane-header">
            <span class="pane-title">编辑</span>
            <span v-if="pendingOperations.length > 0" class="pending-indicator">
              {{ pendingOperations.length }} 待同步
            </span>
          </div>
          <div class="pane-content">
            <MarkdownEditor
              v-if="currentDocument"
              v-model="editorContent"
              :document-id="currentDocument.id"
              @change="onContentChange"
            />
            <div v-else class="empty-state">
              <p>请选择或创建一个文档</p>
            </div>
          </div>
        </div>

        <div class="preview-pane">
          <div class="pane-header">
            <span class="pane-title">预览</span>
          </div>
          <div class="pane-content">
            <MarkdownPreview :content="editorContent" />
          </div>
        </div>

        <div v-if="showHistory && currentDocument" class="history-pane">
          <DocumentHistory
            :document-id="currentDocument.id"
            :connected="connected"
            @rollback="handleRollback"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentDocument, fetchDocuments, updateDocument } = useDocuments()
const {
  connect,
  joinDocument,
  leaveDocument,
  connected,
  wsEnabled,
  onlineUsers,
  documentVersion,
  pendingOperations,
  rollbackToSnapshot
} = useCollaboration()

const editorContent = ref('')
const isSaved = ref(true)
const showHistory = ref(false)
let saveTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  await fetchDocuments()
  
  if (process.client) {
    connect()
  }
})

watch(currentDocument, (newDoc, oldDoc) => {
  if (oldDoc) {
    leaveDocument()
  }
  
  if (newDoc) {
    editorContent.value = newDoc.content
    isSaved.value = true
    showHistory.value = false
    
    nextTick(() => {
      joinDocument(newDoc.id)
    })
  } else {
    editorContent.value = ''
    showHistory.value = false
  }
}, { immediate: true })

function onContentChange(content: string) {
  isSaved.value = false
  
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  
  saveTimeout = setTimeout(async () => {
    if (currentDocument.value) {
      try {
        await updateDocument(currentDocument.value.id, { content })
        isSaved.value = true
      } catch (e) {
        console.error('保存失败:', e)
      }
    }
  }, 1000)
}

function handleRollback(snapshotId: string) {
  rollbackToSnapshot(snapshotId)
  isSaved.value = false
  setTimeout(() => {
    isSaved.value = true
  }, 500)
}

onUnmounted(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  leaveDocument()
})
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
  flex-shrink: 0;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.doc-title-display {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.save-status {
  font-size: 12px;
  color: #f0883e;
  flex-shrink: 0;
}

.save-status.saved {
  color: #2ea043;
}

.version-badge {
  font-size: 11px;
  font-family: monospace;
  background: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.online-users {
  display: flex;
  align-items: center;
  gap: 6px;
}

.online-label {
  font-size: 12px;
  color: #666;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.btn-history {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #d0d0d0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-history:hover {
  background: #f5f5f5;
}

.btn-history.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.connection-status {
  font-size: 13px;
}

.connection-status.connected {
  color: #2ea043;
}

.connection-status.disconnected {
  color: #888;
}

.connection-status.disabled {
  color: #c97c0c;
}

.editor-preview-area {
  flex: 1;
  display: flex;
  min-height: 0;
}

.editor-pane,
.preview-pane,
.history-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.editor-pane {
  flex: 1;
  border-right: 1px solid #e0e0e0;
}

.preview-pane {
  flex: 1;
}

.history-pane {
  width: 320px;
  flex-shrink: 0;
}

.pane-header {
  padding: 10px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pane-title {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.pending-indicator {
  font-size: 11px;
  color: #f59e0b;
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 10px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.pane-content {
  flex: 1;
  overflow: hidden;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
</style>
