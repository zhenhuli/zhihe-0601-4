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

export interface OperationMessage {
  id: string
  documentId: string
  userId: string
  version: number
  operations: TextOperation[]
  timestamp: number
  cursor?: CursorPosition
}

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

export function applyOperation(doc: string, op: TextOperation): string {
  if (op.type === 'insert') {
    if (op.position < 0 || op.position > doc.length) {
      throw new Error(`Invalid insert position: ${op.position}, doc length: ${doc.length}`)
    }
    return doc.slice(0, op.position) + op.text + doc.slice(op.position)
  } else if (op.type === 'delete') {
    if (op.position < 0 || op.position + op.length > doc.length) {
      throw new Error(`Invalid delete operation: position=${op.position}, length=${op.length}, doc length=${doc.length}`)
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

export function invertOperation(op: TextOperation, originalDoc: string): TextOperation {
  if (op.type === 'insert') {
    return {
      type: 'delete',
      position: op.position,
      length: op.text.length
    }
  } else {
    return {
      type: 'insert',
      position: op.position,
      text: originalDoc.slice(op.position, op.position + op.length)
    }
  }
}

export function generateOperationId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

const USER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00CED1', '#FF7F50', '#9370DB', '#3CB371'
]

export function getUserColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash |= 0
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length]
}
