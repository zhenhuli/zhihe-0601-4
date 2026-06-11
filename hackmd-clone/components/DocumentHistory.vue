<template>
  <div class="document-history">
    <div class="history-header">
      <h3>历史版本</h3>
      <button class="btn-refresh" @click="refreshHistory" :disabled="loading">
        {{ loading ? '刷新中...' : '刷新' }}
      </button>
      <button class="btn-snapshot" @click="createSnapshot" :disabled="loading">
        创建快照
      </button>
    </div>

    <div v-if="snapshots.length === 0" class="empty-state">
      <p>暂无历史快照</p>
      <p class="hint">每5分钟自动保存一个快照</p>
    </div>

    <div v-else class="snapshot-list">
      <div
        v-for="snapshot in snapshots"
        :key="snapshot.id"
        class="snapshot-item"
        :class="{ active: selectedSnapshotId === snapshot.id }"
        @click="selectSnapshot(snapshot)"
      >
        <div class="snapshot-info">
          <div class="snapshot-title">{{ snapshot.title }}</div>
          <div class="snapshot-meta">
            <span class="version">v{{ snapshot.version }}</span>
            <span class="time">{{ formatTime(snapshot.timestamp) }}</span>
          </div>
        </div>
        <div class="snapshot-actions">
          <button class="btn-preview" @click.stop="openPreview(snapshot)">
            预览
          </button>
          <button class="btn-restore" @click.stop="restoreSnapshot(snapshot)">
            恢复
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPreview" class="preview-modal" @click.self="closePreview">
      <div class="preview-content">
        <div class="preview-header">
          <h3>版本预览 - v{{ previewSnapshot?.version }}</h3>
          <button class="btn-close" @click="closePreview">×</button>
        </div>
        <div class="preview-body">
          <pre class="preview-text">{{ previewSnapshot?.content }}</pre>
        </div>
        <div class="preview-footer">
          <button class="btn-cancel" @click="closePreview">取消</button>
          <button class="btn-confirm" @click="confirmRestore">恢复此版本</button>
        </div>
      </div>
    </div>

    <div v-if="showConfirm" class="confirm-modal" @click.self="showConfirm = false">
      <div class="confirm-content">
        <h3>确认恢复</h3>
        <p>确定要恢复到版本 v{{ confirmSnapshot?.version }} 吗？</p>
        <p class="warning">当前内容将被覆盖，但也会保存为新的版本。</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="showConfirm = false">取消</button>
          <button class="btn-confirm" @click="doRestore">确认恢复</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocumentSnapshot } from '../composables/useCollaboration'

const props = defineProps<{
  documentId: string | null
  connected: boolean
}>()

const emit = defineEmits<{
  'rollback': [snapshotId: string]
}>()

const { snapshots, getHistory, createManualSnapshot } = useCollaboration()

const loading = ref(false)
const selectedSnapshotId = ref<string | null>(null)
const showPreview = ref(false)
const showConfirm = ref(false)
const previewSnapshot = ref<DocumentSnapshot | null>(null)
const confirmSnapshot = ref<DocumentSnapshot | null>(null)

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)} 天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

function refreshHistory() {
  if (!props.documentId || !props.connected) return
  loading.value = true
  getHistory()
  setTimeout(() => {
    loading.value = false
  }, 500)
}

function createSnapshot() {
  if (!props.documentId || !props.connected) return
  loading.value = true
  createManualSnapshot()
  setTimeout(() => {
    loading.value = false
  }, 500)
}

function selectSnapshot(snapshot: DocumentSnapshot) {
  selectedSnapshotId.value = snapshot.id
}

function openPreview(snapshot: DocumentSnapshot) {
  previewSnapshot.value = snapshot
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
  previewSnapshot.value = null
}

function restoreSnapshot(snapshot: DocumentSnapshot) {
  confirmSnapshot.value = snapshot
  showConfirm.value = true
}

function confirmRestore() {
  if (previewSnapshot.value) {
    confirmSnapshot.value = previewSnapshot.value
    showPreview.value = false
    showConfirm.value = true
  }
}

function doRestore() {
  if (confirmSnapshot.value) {
    emit('rollback', confirmSnapshot.value.id)
    showConfirm.value = false
    confirmSnapshot.value = null
  }
}

watch(() => props.documentId, () => {
  selectedSnapshotId.value = null
  if (props.documentId && props.connected) {
    refreshHistory()
  }
})

watch(() => props.connected, (newVal) => {
  if (newVal && props.documentId) {
    refreshHistory()
  }
})
</script>

<style scoped>
.document-history {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid #e0e0e0;
}

.history-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.history-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.btn-refresh,
.btn-snapshot {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #d0d0d0;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled),
.btn-snapshot:hover:not(:disabled) {
  background: #e8e8e8;
  border-color: #b0b0b0;
}

.btn-snapshot {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-snapshot:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.empty-state p {
  margin: 8px 0;
}

.empty-state .hint {
  font-size: 12px;
  color: #bbb;
}

.snapshot-list {
  flex: 1;
  overflow-y: auto;
}

.snapshot-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.snapshot-item:hover {
  background: #f9f9f9;
}

.snapshot-item.active {
  background: #eff6ff;
}

.snapshot-info {
  flex: 1;
  min-width: 0;
}

.snapshot-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.snapshot-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.version {
  font-family: monospace;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}

.snapshot-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.snapshot-item:hover .snapshot-actions {
  opacity: 1;
}

.btn-preview,
.btn-restore {
  padding: 4px 8px;
  font-size: 11px;
  border: 1px solid #d0d0d0;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-preview:hover {
  background: #f0f0f0;
}

.btn-restore {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-restore:hover {
  background: #059669;
  border-color: #059669;
}

.preview-modal,
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-content,
.confirm-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.confirm-content {
  max-width: 400px;
  padding: 24px;
}

.confirm-content h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.confirm-content p {
  margin: 8px 0;
  color: #555;
}

.confirm-content .warning {
  color: #f59e0b;
  font-size: 13px;
}

.preview-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-header h3 {
  margin: 0;
  font-size: 16px;
}

.btn-close {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.btn-close:hover {
  color: #333;
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.preview-text {
  margin: 0;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #333;
}

.preview-footer,
.confirm-actions {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-actions {
  padding: 20px 0 0 0;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-confirm {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-confirm:hover {
  background: #059669;
  border-color: #059669;
}
</style>
