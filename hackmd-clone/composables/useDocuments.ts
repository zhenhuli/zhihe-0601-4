import type { Document } from '~/server/types/document'

const documents = ref<Document[]>([])
const currentDocument = ref<Document | null>(null)
const loading = ref(false)

export const useDocuments = () => {

  async function fetchDocuments() {
    loading.value = true
    try {
      const data = await $fetch<Document[]>('/api/documents')
      documents.value = data
      if (!currentDocument.value && data.length > 0) {
        currentDocument.value = data[0]
      }
    } catch (e) {
      console.error('获取文档列表失败:', e)
    } finally {
      loading.value = false
    }
  }

  async function createDocument(title: string) {
    try {
      const doc = await $fetch<Document>('/api/documents', {
        method: 'POST',
        body: { title }
      })
      documents.value.unshift(doc)
      currentDocument.value = doc
      return doc
    } catch (e) {
      console.error('创建文档失败:', e)
      throw e
    }
  }

  async function updateDocument(id: string, updates: { title?: string; content?: string }) {
    try {
      const doc = await $fetch<Document>(`/api/documents/${id}`, {
        method: 'PUT',
        body: updates
      })
      const index = documents.value.findIndex(d => d.id === id)
      if (index !== -1) {
        documents.value[index] = doc
      }
      if (currentDocument.value?.id === id) {
        currentDocument.value = doc
      }
      return doc
    } catch (e) {
      console.error('更新文档失败:', e)
      throw e
    }
  }

  async function deleteDocument(id: string) {
    try {
      await $fetch(`/api/documents/${id}`, {
        method: 'DELETE'
      })
      documents.value = documents.value.filter(d => d.id !== id)
      if (currentDocument.value?.id === id) {
        currentDocument.value = documents.value[0] || null
      }
    } catch (e) {
      console.error('删除文档失败:', e)
      throw e
    }
  }

  function selectDocument(doc: Document) {
    currentDocument.value = doc
  }

  return {
    documents,
    currentDocument,
    loading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    selectDocument
  }
}
