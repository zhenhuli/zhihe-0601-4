export interface InsertOperation {
  type: 'insert'
  position: number
  text: string
}

export interface DeleteOperation {
  type: 'delete'
  position: number
  length: number
}

export type TextOperation = InsertOperation | DeleteOperation

export interface CursorPosition {
  line: number
  ch: number
  anchor?: { line: number; ch: number }
  head?: { line: number; ch: number }
}

export interface UserCursor {
  userId: string
  position: CursorPosition
  color: string
  timestamp: number
}

export interface DocumentSnapshot {
  id: string
  documentId: string
  version: number
  content: string
  title: string
  timestamp: number
}

export interface OnlineUser {
  userId: string
  color: string
  cursor?: CursorPosition
}

const ws = ref<WebSocket | null>(null)
const connected = ref(false)
const userId = ref<string | null>(null)
const userColor = ref<string>('#3b82f6')
const onlineUsers = ref<OnlineUser[]>([])
const remoteCursors = ref<Map<string, UserCursor>>(new Map())
const documentVersion = ref(0)
const serverVersion = ref(0)
const localContent = ref<string>('')
const isRemoteUpdate = ref(false)
const wsEnabled = ref(true)

const pendingOperations = ref<Array<{
  id: string
  operations: TextOperation[]
  version: number
  timestamp: number
}>>([])

const incomingOperations = ref<Array<{
  userId: string
  operations: TextOperation[]
  version: number
  timestamp: number
  cursor?: CursorPosition
}>>([])

const snapshots = ref<DocumentSnapshot[]>([])

let reconnectAttempts = 0
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
let lastContent = ''

export function applyOperation(doc: string, op: TextOperation): string {
  if (op.type === 'insert') {
    if (op.position < 0 || op.position > doc.length) {
      console.warn(`Invalid insert position: ${op.position}, doc length: ${doc.length}`)
      return doc
    }
    return doc.slice(0, op.position) + op.text + doc.slice(op.position)
  } else if (op.type === 'delete') {
    if (op.position < 0 || op.position + op.length > doc.length) {
      console.warn(`Invalid delete operation: position=${op.position}, length=${op.length}, doc length=${doc.length}`)
      return doc
    }
    return doc.slice(0, op.position) + doc.slice(op.position + op.length)
  }
  return doc
}

export function applyOperations(doc: string, ops: TextOperation[]): string {
  let result = doc
  for (const op of ops) {
    result = applyOperation(result, op)
  }
  return result
}

export function transform(op1: TextOperation, op2: TextOperation): [TextOperation, TextOperation] {
  if (op1.type === 'insert' && op2.type === 'insert') {
    return transformInsertAgainstInsert(op1, op2)
  } else if (op1.type === 'insert' && op2.type === 'delete') {
    return transformInsertAgainstDelete(op1, op2)
  } else if (op1.type === 'delete' && op2.type === 'insert') {
    return transformDeleteAgainstInsert(op1, op2)
  } else if (op1.type === 'delete' && op2.type === 'delete') {
    return transformDeleteAgainstDelete(op1, op2)
  }
  return [op1, op2]
}

function transformInsertAgainstInsert(
  op1: InsertOperation,
  op2: InsertOperation
): [InsertOperation, InsertOperation] {
  const newOp1: InsertOperation = { ...op1 }
  const newOp2: InsertOperation = { ...op2 }

  if (op1.position < op2.position) {
    newOp2.position = op2.position + op1.text.length
  } else if (op1.position > op2.position) {
    newOp1.position = op1.position + op2.text.length
  } else {
    newOp2.position = op2.position + op1.text.length
  }

  return [newOp1, newOp2]
}

function transformInsertAgainstDelete(
  op1: InsertOperation,
  op2: DeleteOperation
): [InsertOperation, DeleteOperation] {
  const newOp1: InsertOperation = { ...op1 }
  const newOp2: DeleteOperation = { ...op2 }

  if (op1.position <= op2.position) {
    newOp2.position = op2.position + op1.text.length
  } else if (op1.position > op2.position && op1.position < op2.position + op2.length) {
    newOp2.length = op2.length + op1.text.length
  } else if (op1.position >= op2.position + op2.length) {
    newOp1.position = op1.position - op2.length
  }

  return [newOp1, newOp2]
}

function transformDeleteAgainstInsert(
  op1: DeleteOperation,
  op2: InsertOperation
): [DeleteOperation, InsertOperation] {
  const newOp1: DeleteOperation = { ...op1 }
  const newOp2: InsertOperation = { ...op2 }

  if (op2.position <= op1.position) {
    newOp1.position = op1.position + op2.text.length
  } else if (op2.position > op1.position && op2.position < op1.position + op1.length) {
    newOp1.length = op1.length + op2.text.length
  } else if (op2.position >= op1.position + op1.length) {
    newOp2.position = op2.position - op1.length
  }

  return [newOp1, newOp2]
}

function transformDeleteAgainstDelete(
  op1: DeleteOperation,
  op2: DeleteOperation
): [DeleteOperation, DeleteOperation] {
  const newOp1: DeleteOperation = { ...op1 }
  const newOp2: DeleteOperation = { ...op2 }

  const op1End = op1.position + op1.length
  const op2End = op2.position + op2.length

  if (op1End <= op2.position) {
    newOp2.position = op2.position - op1.length
  } else if (op2End <= op1.position) {
    newOp1.position = op1.position - op2.length
  } else {
    const overlapStart = Math.max(op1.position, op2.position)
    const overlapEnd = Math.min(op1End, op2End)
    const overlapLength = overlapEnd - overlapStart

    if (op1.position <= op2.position) {
      newOp1.length = op1.length - overlapLength
      newOp2.position = op1.position
      newOp2.length = op2.length - overlapLength
    } else {
      newOp2.length = op2.length - overlapLength
      newOp1.position = op2.position
      newOp1.length = op1.length - overlapLength
    }
  }

  if (newOp1.length < 0) newOp1.length = 0
  if (newOp2.length < 0) newOp2.length = 0

  return [newOp1, newOp2]
}

export function transformOperations(
  ops1: TextOperation[],
  ops2: TextOperation[]
): [TextOperation[], TextOperation[]] {
  let transformedOps1: TextOperation[] = [...ops1]
  let transformedOps2: TextOperation[] = [...ops2]

  for (let i = 0; i < transformedOps1.length; i++) {
    for (let j = 0; j < transformedOps2.length; j++) {
      const [newOp1, newOp2] = transform(transformedOps1[i], transformedOps2[j])
      transformedOps1[i] = newOp1
      transformedOps2[j] = newOp2
    }
  }

  return [transformedOps1, transformedOps2]
}

export function computeOperations(oldText: string, newText: string): TextOperation[] {
  const operations: TextOperation[] = []
  let i = 0
  let j = 0

  while (i < oldText.length || j < newText.length) {
    if (i < oldText.length && j < newText.length && oldText[i] === newText[j]) {
      i++
      j++
    } else {
      let match = false
      let bestMatch = { i: -1, j: -1, length: 0 }

      for (let windowSize = Math.min(10, oldText.length - i, newText.length - j); windowSize >= 3 && !match; windowSize--) {
        for (let oi = i; oi <= oldText.length - windowSize && !match; oi++) {
          for (let nj = j; nj <= newText.length - windowSize && !match; nj++) {
            if (oldText.slice(oi, oi + windowSize) === newText.slice(nj, nj + windowSize)) {
              bestMatch = { i: oi, j: nj, length: windowSize }
              match = true
            }
          }
        }
      }

      if (match && bestMatch.length > 0) {
        if (bestMatch.i > i) {
          operations.push({
            type: 'delete',
            position: i,
            length: bestMatch.i - i
          })
        }
        if (bestMatch.j > j) {
          operations.push({
            type: 'insert',
            position: i,
            text: newText.slice(j, bestMatch.j)
          })
        }
        i = bestMatch.i + bestMatch.length
        j = bestMatch.j + bestMatch.length
      } else {
        if (i < oldText.length) {
          operations.push({
            type: 'delete',
            position: i,
            length: oldText.length - i
          })
          i = oldText.length
        }
        if (j < newText.length) {
          operations.push({
            type: 'insert',
            position: i,
            text: newText.slice(j)
          })
          j = newText.length
        }
      }
    }
  }

  return operations.filter(op => op.type === 'delete' ? op.length > 0 : op.text.length > 0)
}

function generateOperationId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export const useCollaboration = () => {
  function connect() {
    if (!wsEnabled.value) return
    if (ws.value && ws.value.readyState === WebSocket.OPEN) return

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/_ws`
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        connected.value = true
        reconnectAttempts = 0
      }

      ws.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)

          switch (message.type) {
            case 'connected':
              userId.value = message.userId
              userColor.value = message.color || '#3b82f6'
              break

            case 'document_state':
              isRemoteUpdate.value = true
              localContent.value = message.document.content
              lastContent = message.document.content
              documentVersion.value = message.version || 0
              serverVersion.value = message.version || 0
              pendingOperations.value = []
              incomingOperations.value = []
              if (message.onlineUsers) {
                onlineUsers.value = message.onlineUsers
              }
              setTimeout(() => {
                isRemoteUpdate.value = false
              }, 50)
              break

            case 'operation':
              if (message.userId !== userId.value) {
                handleIncomingOperation(message)
              }
              break

            case 'operation_ack':
              handleOperationAck(message.operationId, message.version)
              break

            case 'operation_rejected':
              handleOperationRejected(message)
              break

            case 'transform_response':
              handleTransformResponse(message)
              break

            case 'rollback':
            case 'edit':
              if (message.userId !== userId.value) {
                if (message.content !== undefined) {
                  isRemoteUpdate.value = true
                  localContent.value = message.content
                  lastContent = message.content
                  documentVersion.value = message.version || documentVersion.value
                  serverVersion.value = message.version || serverVersion.value
                  pendingOperations.value = []
                  setTimeout(() => {
                    isRemoteUpdate.value = false
                  }, 50)
                }
              }
              if (message.cursor && message.userId !== userId.value) {
                updateRemoteCursor(message.userId, message.cursor, message.color)
              }
              break

            case 'cursor':
              if (message.userId !== userId.value) {
                updateRemoteCursor(message.userId, message.cursor, message.color)
              }
              break

            case 'user_join':
              if (message.onlineUsers) {
                onlineUsers.value = message.onlineUsers
              } else if (message.userId) {
                if (!onlineUsers.value.find(u => u.userId === message.userId)) {
                  onlineUsers.value.push({
                    userId: message.userId,
                    color: message.color || '#3b82f6'
                  })
                }
              }
              break

            case 'user_leave':
              if (message.onlineUsers) {
                onlineUsers.value = message.onlineUsers
              } else if (message.userId) {
                onlineUsers.value = onlineUsers.value.filter(u => u.userId !== message.userId)
                remoteCursors.value.delete(message.userId)
              }
              break

            case 'history':
              snapshots.value = message.snapshots || []
              break

            case 'snapshot_created':
              if (message.snapshot) {
                const exists = snapshots.value.find(s => s.id === message.snapshot.id)
                if (!exists) {
                  snapshots.value.push(message.snapshot)
                  snapshots.value.sort((a, b) => b.timestamp - a.timestamp)
                }
              }
              break

            case 'rollback_failed':
              console.error('Rollback failed:', message.reason)
              break
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e)
        }
      }

      ws.value.onclose = () => {
        connected.value = false
        onlineUsers.value = []
        remoteCursors.value.clear()

        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout)
        }

        reconnectAttempts++
        if (reconnectAttempts > 5) {
          console.warn('WebSocket reconnection attempts exceeded, disabling real-time collaboration')
          wsEnabled.value = false
          return
        }

        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000)
        reconnectTimeout = setTimeout(() => {
          connect()
        }, delay)
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (e) {
      console.error('Failed to create WebSocket connection:', e)
      wsEnabled.value = false
    }
  }

  function handleIncomingOperation(message: any) {
    const incomingOps: TextOperation[] = message.operations

    incomingOperations.value.push({
      userId: message.userId,
      operations: incomingOps,
      version: message.version,
      timestamp: message.timestamp,
      cursor: message.cursor
    })

    if (message.cursor) {
      updateRemoteCursor(message.userId, message.cursor, message.color)
    }

    if (pendingOperations.value.length > 0) {
      for (let i = 0; i < pendingOperations.value.length; i++) {
        const pending = pendingOperations.value[i]
        const [transformedPending, transformedIncoming] = transformOperations(
          pending.operations,
          incomingOps
        )
        pendingOperations.value[i].operations = transformedPending
        for (let j = 0; j < incomingOps.length; j++) {
          incomingOps[j] = transformedIncoming[j]
        }
      }
    }

    isRemoteUpdate.value = true
    localContent.value = applyOperations(localContent.value, incomingOps)
    lastContent = localContent.value
    documentVersion.value = message.version
    serverVersion.value = message.version
    setTimeout(() => {
      isRemoteUpdate.value = false
    }, 10)
  }

  function handleOperationAck(operationId: string, version: number) {
    const index = pendingOperations.value.findIndex(op => op.id === operationId)
    if (index !== -1) {
      pendingOperations.value.splice(index, 1)
      serverVersion.value = version
    }
  }

  function handleOperationRejected(message: any) {
    const { operationId, reason, currentVersion } = message
    console.warn(`Operation ${operationId} rejected: ${reason}`)

    const index = pendingOperations.value.findIndex(op => op.id === operationId)
    if (index !== -1 && reason === 'version_mismatch') {
      const pending = pendingOperations.value[index]
      const requestTransform = {
        type: 'operation_transform',
        operationId,
        operations: pending.operations,
        version: pending.version
      }
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify(requestTransform))
      }
    }
  }

  function handleTransformResponse(message: any) {
    const { operationId, transformedOps, newVersion } = message
    const index = pendingOperations.value.findIndex(op => op.id === operationId)

    if (index !== -1) {
      pendingOperations.value[index].operations = transformedOps
      pendingOperations.value[index].version = newVersion

      const pending = pendingOperations.value[index]
      sendOperations(pending.operations, newVersion, operationId)
    }
  }

  function updateRemoteCursor(uid: string, cursor: CursorPosition, color: string) {
    remoteCursors.value.set(uid, {
      userId: uid,
      position: cursor,
      color: color || '#3b82f6',
      timestamp: Date.now()
    })
  }

  function joinDocument(documentId: string) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    try {
      pendingOperations.value = []
      incomingOperations.value = []
      ws.value.send(JSON.stringify({
        type: 'join',
        documentId
      }))
    } catch (e) {
      console.error('Failed to send join message:', e)
    }
  }

  function sendOperations(operations: TextOperation[], version: number, operationId?: string): boolean {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return false
    if (operations.length === 0) return false

    try {
      const opId = operationId || generateOperationId()
      if (!operationId) {
        pendingOperations.value.push({
          id: opId,
          operations,
          version,
          timestamp: Date.now()
        })
      }

      ws.value.send(JSON.stringify({
        type: 'operation',
        operationId: opId,
        operations,
        version
      }))
      return true
    } catch (e) {
      console.error('Failed to send operations:', e)
      return false
    }
  }

  function sendEdit(newContent: string, cursor?: CursorPosition) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return

    const operations = computeOperations(lastContent, newContent)
    if (operations.length === 0) {
      lastContent = newContent
      return
    }

    const version = serverVersion.value
    const operationId = generateOperationId()

    pendingOperations.value.push({
      id: operationId,
      operations,
      version,
      timestamp: Date.now()
    })

    localContent.value = newContent
    lastContent = newContent
    documentVersion.value = version + pendingOperations.value.length

    try {
      ws.value.send(JSON.stringify({
        type: 'operation',
        operationId,
        operations,
        version,
        cursor
      }))
    } catch (e) {
      console.error('Failed to send edit message:', e)
    }
  }

  function sendCursor(cursor: CursorPosition) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    try {
      ws.value.send(JSON.stringify({
        type: 'cursor',
        cursor
      }))
    } catch (e) {
      console.error('Failed to send cursor message:', e)
    }
  }

  function getHistory() {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    try {
      ws.value.send(JSON.stringify({
        type: 'get_history'
      }))
    } catch (e) {
      console.error('Failed to get history:', e)
    }
  }

  function createManualSnapshot() {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    try {
      ws.value.send(JSON.stringify({
        type: 'create_snapshot'
      }))
    } catch (e) {
      console.error('Failed to create snapshot:', e)
    }
  }

  function rollbackToSnapshot(snapshotId: string) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    try {
      ws.value.send(JSON.stringify({
        type: 'rollback',
        snapshotId
      }))
    } catch (e) {
      console.error('Failed to rollback:', e)
    }
  }

  function rollbackToVersion(version: number) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    try {
      ws.value.send(JSON.stringify({
        type: 'rollback',
        version
      }))
    } catch (e) {
      console.error('Failed to rollback:', e)
    }
  }

  function leaveDocument() {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    try {
      pendingOperations.value = []
      incomingOperations.value = []
      ws.value.send(JSON.stringify({
        type: 'leave'
      }))
    } catch (e) {
      console.error('Failed to send leave message:', e)
    }
  }

  function disconnect() {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    if (ws.value) {
      try {
        ws.value.close()
      } catch (e) {
        console.error('Error closing WebSocket:', e)
      }
      ws.value = null
    }
    connected.value = false
    onlineUsers.value = []
    remoteCursors.value.clear()
    pendingOperations.value = []
    incomingOperations.value = []
  }

  function setLocalContent(content: string) {
    lastContent = content
    localContent.value = content
  }

  return {
    ws,
    connected,
    userId,
    userColor,
    onlineUsers,
    remoteCursors,
    documentVersion,
    serverVersion,
    localContent,
    isRemoteUpdate,
    wsEnabled,
    pendingOperations,
    incomingOperations,
    snapshots,
    connect,
    joinDocument,
    sendEdit,
    sendOperations,
    sendCursor,
    getHistory,
    createManualSnapshot,
    rollbackToSnapshot,
    rollbackToVersion,
    leaveDocument,
    disconnect,
    setLocalContent,
    computeOperations,
    applyOperations,
    applyOperation,
    transform,
    transformOperations
  }
}
