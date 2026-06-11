import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import {
  initStorage,
  updateDocument,
  getDocumentById,
  applyOperationsToDocument,
  getDocumentVersion,
  getSnapshots,
  rollbackToSnapshot,
  rollbackToVersion,
  createSnapshot
} from '../storage/documentStorage'
import type { TextOperation, CursorPosition } from '../ot/operations'
import { transformOperations, getUserColor, generateOperationId } from '../ot/operations'
import type { DocumentSnapshot } from '../types/document'

interface Client {
  ws: WebSocket
  documentId: string | null
  userId: string
  cursor?: CursorPosition
}

interface DocumentSession {
  documentId: string
  pendingOperations: Map<string, { userId: string; operations: TextOperation[]; version: number }>
  lastServerVersion: number
}

const clients: Set<Client> = new Set()
const documentSessions: Map<string, DocumentSession> = new Map()
let wss: WebSocketServer | null = null
let storageInitialized = false

function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

function broadcastToDocument(documentId: string, message: object, excludeClient?: Client) {
  for (const client of clients) {
    if (client.documentId === documentId && client !== excludeClient && client.ws.readyState === 1) {
      client.ws.send(JSON.stringify(message))
    }
  }
}

function sendToClient(client: Client, message: object) {
  if (client.ws.readyState === 1) {
    client.ws.send(JSON.stringify(message))
  }
}

function getOrCreateDocumentSession(documentId: string): DocumentSession {
  let session = documentSessions.get(documentId)
  if (!session) {
    session = {
      documentId,
      pendingOperations: new Map(),
      lastServerVersion: getDocumentVersion(documentId)
    }
    documentSessions.set(documentId, session)
  }
  return session
}

function getOnlineUsers(documentId: string): Array<{ userId: string; color: string; cursor?: CursorPosition }> {
  return Array.from(clients)
    .filter(c => c.documentId === documentId)
    .map(c => ({
      userId: c.userId,
      color: getUserColor(c.userId),
      cursor: c.cursor
    }))
}

function handleConnection(ws: WebSocket) {
  if (!storageInitialized) {
    initStorage()
    storageInitialized = true
  }

  const client: Client = {
    ws,
    documentId: null,
    userId: generateUserId()
  }
  clients.add(client)

  sendToClient(client, {
    type: 'connected',
    userId: client.userId,
    color: getUserColor(client.userId)
  })

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())

      switch (message.type) {
        case 'join': {
          const oldDocumentId = client.documentId
          client.documentId = message.documentId

          if (oldDocumentId && oldDocumentId !== message.documentId) {
            broadcastToDocument(oldDocumentId, {
              type: 'user_leave',
              userId: client.userId,
              onlineUsers: getOnlineUsers(oldDocumentId)
            }, client)
          }

          const doc = getDocumentById(message.documentId)
          if (doc) {
            getOrCreateDocumentSession(message.documentId)
            sendToClient(client, {
              type: 'document_state',
              document: doc,
              version: doc.version,
              onlineUsers: getOnlineUsers(message.documentId)
            })
          }

          broadcastToDocument(message.documentId, {
            type: 'user_join',
            userId: client.userId,
            color: getUserColor(client.userId),
            onlineUsers: getOnlineUsers(message.documentId)
          }, client)
          break
        }

        case 'operation': {
          if (!client.documentId) break

          const session = getOrCreateDocumentSession(client.documentId)
          const operations: TextOperation[] = message.operations
          const clientVersion: number = message.version
          const opId = message.operationId || generateOperationId()

          if (operations.length === 0) break

          if (clientVersion !== session.lastServerVersion) {
            sendToClient(client, {
              type: 'operation_rejected',
              operationId: opId,
              reason: 'version_mismatch',
              currentVersion: session.lastServerVersion
            })
            break
          }

          const updatedDoc = applyOperationsToDocument(
            client.documentId,
            operations,
            clientVersion
          )

          if (updatedDoc) {
            session.lastServerVersion = updatedDoc.version
            session.pendingOperations.delete(opId)

            broadcastToDocument(client.documentId, {
              type: 'operation',
              operationId: opId,
              userId: client.userId,
              operations,
              version: updatedDoc.version,
              timestamp: Date.now(),
              cursor: message.cursor
            }, client)

            sendToClient(client, {
              type: 'operation_ack',
              operationId: opId,
              version: updatedDoc.version
            })

            if (message.cursor) {
              client.cursor = message.cursor
              broadcastToDocument(client.documentId, {
                type: 'cursor',
                userId: client.userId,
                cursor: message.cursor,
                color: getUserColor(client.userId)
              }, client)
            }
          } else {
            sendToClient(client, {
              type: 'operation_rejected',
              operationId: opId,
              reason: 'apply_failed',
              currentVersion: session.lastServerVersion
            })
          }
          break
        }

        case 'operation_transform': {
          if (!client.documentId) break

          const session = getOrCreateDocumentSession(client.documentId)
          const incomingOps: TextOperation[] = message.operations
          const clientVersion: number = message.version
          const opId = message.operationId || generateOperationId()

          if (clientVersion < session.lastServerVersion) {
            const transformed = transformOperations(
              incomingOps,
              []
            )

            sendToClient(client, {
              type: 'transform_response',
              operationId: opId,
              originalOps: incomingOps,
              transformedOps: transformed[0],
              newVersion: session.lastServerVersion
            })
          }
          break
        }

        case 'edit': {
          if (!client.documentId) break

          const doc = updateDocument(client.documentId, { content: message.content })
          if (doc) {
            broadcastToDocument(client.documentId, {
              type: 'edit',
              userId: client.userId,
              content: message.content,
              version: doc.version,
              cursor: message.cursor
            }, client)

            if (message.cursor) {
              client.cursor = message.cursor
            }
          }
          break
        }

        case 'cursor': {
          if (!client.documentId) break

          client.cursor = message.cursor

          broadcastToDocument(client.documentId, {
            type: 'cursor',
            userId: client.userId,
            cursor: message.cursor,
            color: getUserColor(client.userId)
          }, client)
          break
        }

        case 'get_history': {
          if (!client.documentId) break

          const history = getSnapshots(client.documentId)
          sendToClient(client, {
            type: 'history',
            snapshots: history
          })
          break
        }

        case 'create_snapshot': {
          if (!client.documentId) break

          const snapshot = createSnapshot(client.documentId)
          if (snapshot) {
            sendToClient(client, {
              type: 'snapshot_created',
              snapshot
            })

            broadcastToDocument(client.documentId, {
              type: 'snapshot_created',
              snapshot
            })
          }
          break
        }

        case 'rollback': {
          if (!client.documentId) break

          let updatedDoc = null
          if (message.snapshotId) {
            updatedDoc = rollbackToSnapshot(client.documentId, message.snapshotId)
          } else if (message.version !== undefined) {
            updatedDoc = rollbackToVersion(client.documentId, message.version)
          }

          if (updatedDoc) {
            const session = getOrCreateDocumentSession(client.documentId)
            session.lastServerVersion = updatedDoc.version

            broadcastToDocument(client.documentId, {
              type: 'rollback',
              userId: client.userId,
              document: updatedDoc,
              version: updatedDoc.version
            })

            const doc = getDocumentById(client.documentId)
            if (doc) {
              for (const c of clients) {
                if (c.documentId === client.documentId && c.ws.readyState === 1) {
                  sendToClient(c, {
                    type: 'document_state',
                    document: doc,
                    version: doc.version,
                    onlineUsers: getOnlineUsers(client.documentId)
                  })
                }
              }
            }
          } else {
            sendToClient(client, {
              type: 'rollback_failed',
              reason: 'snapshot_not_found'
            })
          }
          break
        }

        case 'leave': {
          if (client.documentId) {
            broadcastToDocument(client.documentId, {
              type: 'user_leave',
              userId: client.userId,
              onlineUsers: getOnlineUsers(client.documentId)
            }, client)
          }
          client.documentId = null
          client.cursor = undefined
          break
        }
      }
    } catch (e) {
      console.error('WebSocket message error:', e)
    }
  })

  ws.on('close', () => {
    if (client.documentId) {
      broadcastToDocument(client.documentId, {
        type: 'user_leave',
        userId: client.userId,
        onlineUsers: getOnlineUsers(client.documentId)
      }, client)
    }
    clients.delete(client)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  console.log('WebSocket client connected:', client.userId)
}

export default defineEventHandler((event) => {
  if (!process.server) return

  const nodeReq = event.node.req as any
  const upgrade = nodeReq.headers.upgrade?.toLowerCase()

  if (upgrade === 'websocket') {
    if (!wss) {
      wss = new WebSocketServer({ noServer: true })
      console.log('WebSocket server created')
    }

    const socket = nodeReq.socket
    if (socket) {
      wss.handleUpgrade(nodeReq, socket, Buffer.alloc(0), (ws) => {
        wss!.emit('connection', ws, nodeReq)
        handleConnection(ws)
      })

      event._handled = true
      return null
    }
  }

  return { status: 'WebSocket endpoint' }
})

