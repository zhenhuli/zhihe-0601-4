<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>文档列表</h2>
      <button class="btn-new" @click="showNewDialog = true">
        <span>+</span> 新建
      </button>
    </div>

    <div class="document-list">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="document-item"
        :class="{ active: currentDocument?.id === doc.id }"
        @click="selectDocument(doc)"
      >
        <div class="doc-info">
          <input
            v-if="editingId === doc.id"
            v-model="editTitle"
            class="doc-title-input"
            @click.stop
            @blur="saveTitle(doc.id)"
            @keyup.enter="saveTitle(doc.id)"
            @keyup.esc="cancelEdit"
            ref="titleInput"
          />
          <span v-else class="doc-title">{{ doc.title }}</span>
          <span class="doc-time">{{ formatTime(doc.updatedAt) }}</span>
        </div>
        <div class="doc-actions">
          <button class="btn-icon" @click.stop="startEdit(doc)" title="重命名">
            ✏️
          </button>
          <button class="btn-icon" @click.stop="confirmDelete(doc)" title="删除">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <div class="online-info" v-if="onlineUsers.length > 0">
      <div class="online-dot" :class="{ connected }"></div>
      <span>{{ onlineUsers.length }} 人在线</span>
    </div>

    <div v-if="showNewDialog" class="modal-overlay" @click="showNewDialog = false">
      <div class="modal" @click.stop>
        <h3>新建文档</h3>
        <input
          v-model="newTitle"
          placeholder="输入文档标题..."
          @keyup.enter="createNewDocument"
          ref="newTitleInput"
        />
        <div class="modal-actions">
          <button class="btn-cancel" @click="showNewDialog = false">取消</button>
          <button class="btn-confirm" @click="createNewDocument">创建</button>
        </div>
      </div>
    </div>

    <div v-if="deleteConfirm" class="modal-overlay" @click="deleteConfirm = null">
      <div class="modal" @click.stop>
        <h3>确认删除</h3>
        <p>确定要删除文档 "{{ deleteConfirm.title }}" 吗？</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="deleteConfirm = null">取消</button>
          <button class="btn-delete" @click="executeDelete">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '~/server/types/document'

const { documents, currentDocument, selectDocument, createDocument, updateDocument, deleteDocument } = useDocuments()
const { connected, onlineUsers } = useCollaboration()

const showNewDialog = ref(false)
const newTitle = ref('')
const newTitleInput = ref<HTMLInputElement | null>(null)
const editingId = ref<string | null>(null)
const editTitle = ref('')
const titleInput = ref<HTMLInputElement | null>(null)
const deleteConfirm = ref<Document | null>(null)

watch(showNewDialog, (val) => {
  if (val) {
    nextTick(() => {
      newTitleInput.value?.focus()
    })
  } else {
    newTitle.value = ''
  }
})

watch(editingId, (val) => {
  if (val) {
    nextTick(() => {
      titleInput.value?.focus()
      titleInput.value?.select()
    })
  }
})

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
  
  return date.toLocaleDateString('zh-CN')
}

async function createNewDocument() {
  if (!newTitle.value.trim()) return
  
  try {
    await createDocument(newTitle.value.trim())
    showNewDialog.value = false
  } catch (e) {
    alert('创建失败，请重试')
  }
}

function startEdit(doc: Document) {
  editingId.value = doc.id
  editTitle.value = doc.title
}

async function saveTitle(id: string) {
  if (!editTitle.value.trim()) {
    cancelEdit()
    return
  }
  
  try {
    await updateDocument(id, { title: editTitle.value.trim() })
  } catch (e) {
    alert('重命名失败，请重试')
  }
  
  cancelEdit()
}

function cancelEdit() {
  editingId.value = null
  editTitle.value = ''
}

function confirmDelete(doc: Document) {
  deleteConfirm.value = doc
}

async function executeDelete() {
  if (!deleteConfirm.value) return
  
  try {
    await deleteDocument(deleteConfirm.value.id)
    deleteConfirm.value = null
  } catch (e) {
    alert('删除失败，请重试')
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100%;
  background: #f7f7f7;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 10px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.btn-new {
  padding: 6px 12px;
  background: #0969da;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-new:hover {
  background: #0860c8;
}

.document-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.document-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.15s;
}

.document-item:hover {
  background: #e8e8e8;
}

.document-item.active {
  background: #0969da;
  color: white;
}

.document-item.active .doc-time {
  color: rgba(255, 255, 255, 0.7);
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-title-input {
  width: 100%;
  font-size: 14px;
  padding: 2px 4px;
  border: 1px solid #0969da;
  border-radius: 4px;
  outline: none;
}

.doc-time {
  font-size: 12px;
  color: #888;
}

.doc-actions {
  display: none;
  gap: 4px;
}

.document-item:hover .doc-actions {
  display: flex;
}

.btn-icon {
  padding: 4px 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
}

.btn-icon:hover {
  background: rgba(0, 0, 0, 0.1);
}

.online-info {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

.online-dot.connected {
  background: #2ea043;
}

.modal-overlay {
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

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin-bottom: 16px;
  font-size: 18px;
}

.modal p {
  margin-bottom: 16px;
  color: #666;
}

.modal input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  outline: none;
}

.modal input:focus {
  border-color: #0969da;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel,
.btn-confirm,
.btn-delete {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  background: #0969da;
  color: white;
}

.btn-confirm:hover {
  background: #0860c8;
}

.btn-delete {
  background: #cf222e;
  color: white;
}

.btn-delete:hover {
  background: #b81d28;
}
</style>
