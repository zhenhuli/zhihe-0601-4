import type { Document, DocumentCreate, DocumentUpdate, DocumentSnapshot } from '../types/document'
import type { TextOperation } from '../ot/operations'
import { applyOperations } from '../ot/operations'

let documents: Map<string, Document> = new Map()
let snapshots: Map<string, DocumentSnapshot[]> = new Map()
let lastSnapshotTime: Map<string, number> = new Map()
const SNAPSHOT_INTERVAL = 5 * 60 * 1000

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getDefaultContent(): string {
  return `# 欢迎使用 Markdown 编辑器

这是一个类似 HackMD 的实时协作 Markdown 编辑器。

## 功能特性

- **实时预览**: 左侧编辑，右侧实时预览
- **文档管理**: 新建、打开、保存、删除文档
- **实时协作**: 多用户同时编辑，内容实时同步
- **操作转换**: 基于 OT 算法的增量同步
- **远程光标**: 显示其他用户的编辑位置
- **历史版本**: 自动快照，可回滚到任意历史版本

## 快速开始

1. 在左侧编辑区输入 Markdown 内容
2. 右侧会实时显示渲染效果
3. 点击侧边栏的 "新建文档" 创建新文档

\`\`\`javascript
console.log('Hello, World!')
\`\`\`

> 享受写作的乐趣！
`
}

export function initStorage() {
  const defaultDoc: Document = {
    id: generateId(),
    title: '欢迎文档',
    content: getDefaultContent(),
    version: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  documents.set(defaultDoc.id, defaultDoc)
  snapshots.set(defaultDoc.id, [])
  lastSnapshotTime.set(defaultDoc.id, Date.now())
}

export function getAllDocuments(): Document[] {
  return Array.from(documents.values()).sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getDocumentById(id: string): Document | undefined {
  return documents.get(id)
}

export function getDocumentVersion(id: string): number {
  const doc = documents.get(id)
  return doc ? doc.version : 0
}

export function createDocument(data: DocumentCreate): Document {
  const id = generateId()
  const now = Date.now()
  const doc: Document = {
    id,
    title: data.title,
    content: data.content || '',
    version: 0,
    createdAt: now,
    updatedAt: now
  }
  documents.set(id, doc)
  snapshots.set(id, [])
  lastSnapshotTime.set(id, now)
  createSnapshot(id)
  return doc
}

export function applyOperationsToDocument(
  id: string,
  operations: TextOperation[],
  expectedVersion: number
): Document | null {
  const doc = documents.get(id)
  if (!doc) return null

  if (doc.version !== expectedVersion) {
    return null
  }

  try {
    const newContent = applyOperations(doc.content, operations)
    const updated: Document = {
      ...doc,
      content: newContent,
      version: doc.version + 1,
      updatedAt: Date.now()
    }
    documents.set(id, updated)

    checkAndCreateSnapshot(id)

    return updated
  } catch (e) {
    console.error('Error applying operations:', e)
    return null
  }
}

export function updateDocument(id: string, data: DocumentUpdate): Document | undefined {
  const doc = documents.get(id)
  if (!doc) return undefined

  const updated: Document = {
    ...doc,
    ...data,
    version: doc.version + 1,
    updatedAt: Date.now()
  }
  documents.set(id, updated)

  checkAndCreateSnapshot(id)

  return updated
}

export function deleteDocument(id: string): boolean {
  const result = documents.delete(id)
  if (result) {
    snapshots.delete(id)
    lastSnapshotTime.delete(id)
  }
  return result
}

function checkAndCreateSnapshot(id: string) {
  const now = Date.now()
  const lastTime = lastSnapshotTime.get(id) || 0

  if (now - lastTime >= SNAPSHOT_INTERVAL) {
    createSnapshot(id)
  }
}

export function createSnapshot(id: string): DocumentSnapshot | null {
  const doc = documents.get(id)
  if (!doc) return null

  const snapshot: DocumentSnapshot = {
    id: generateId(),
    documentId: id,
    version: doc.version,
    content: doc.content,
    title: doc.title,
    timestamp: Date.now()
  }

  const docSnapshots = snapshots.get(id) || []
  docSnapshots.push(snapshot)

  if (docSnapshots.length > 100) {
    docSnapshots.shift()
  }

  snapshots.set(id, docSnapshots)
  lastSnapshotTime.set(id, snapshot.timestamp)

  return snapshot
}

export function getSnapshots(id: string): DocumentSnapshot[] {
  return snapshots.get(id) || []
}

export function getSnapshotById(documentId: string, snapshotId: string): DocumentSnapshot | undefined {
  const docSnapshots = snapshots.get(documentId) || []
  return docSnapshots.find(s => s.id === snapshotId)
}

export function rollbackToSnapshot(documentId: string, snapshotId: string): Document | null {
  const snapshot = getSnapshotById(documentId, snapshotId)
  if (!snapshot) return null

  const doc = documents.get(documentId)
  if (!doc) return null

  const updated: Document = {
    ...doc,
    title: snapshot.title,
    content: snapshot.content,
    version: doc.version + 1,
    updatedAt: Date.now()
  }
  documents.set(documentId, updated)

  createSnapshot(documentId)

  return updated
}

export function rollbackToVersion(documentId: string, targetVersion: number): Document | null {
  const docSnapshots = snapshots.get(documentId) || []
  const snapshot = docSnapshots.find(s => s.version === targetVersion)

  if (snapshot) {
    return rollbackToSnapshot(documentId, snapshot.id)
  }

  const doc = documents.get(documentId)
  if (!doc) return null

  const closestSnapshot = docSnapshots
    .filter(s => s.version <= targetVersion)
    .sort((a, b) => b.version - a.version)[0]

  if (closestSnapshot) {
    return rollbackToSnapshot(documentId, closestSnapshot.id)
  }

  return null
}
