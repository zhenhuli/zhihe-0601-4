import type { TextOperation } from '../ot/operations'

export interface Document {
  id: string
  title: string
  content: string
  version: number
  createdAt: number
  updatedAt: number
}

export interface DocumentCreate {
  title: string
  content?: string
}

export interface DocumentUpdate {
  title?: string
  content?: string
}

export interface DocumentSnapshot {
  id: string
  documentId: string
  version: number
  content: string
  title: string
  timestamp: number
}

export interface PendingOperation {
  id: string
  userId: string
  operations: TextOperation[]
  version: number
  timestamp: number
}
