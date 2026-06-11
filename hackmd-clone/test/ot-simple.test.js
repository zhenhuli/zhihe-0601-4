function applyOperation(doc, op) {
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

function applyOperations(doc, ops) {
  let result = doc
  for (const op of ops) {
    result = applyOperation(result, op)
  }
  return result
}

function transform(op1, op2) {
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

function transformInsertAgainstInsert(op1, op2) {
  const newOp1 = { ...op1 }
  const newOp2 = { ...op2 }

  if (op1.position < op2.position) {
    newOp2.position = op2.position + op1.text.length
  } else if (op1.position > op2.position) {
    newOp1.position = op1.position + op2.text.length
  } else {
    newOp2.position = op2.position + op1.text.length
  }

  return [newOp1, newOp2]
}

function transformInsertAgainstDelete(op1, op2) {
  const newOp1 = { ...op1 }
  const newOp2 = { ...op2 }

  if (op1.position <= op2.position) {
    newOp2.position = op2.position + op1.text.length
  } else if (op1.position > op2.position && op1.position < op2.position + op2.length) {
    newOp2.length = op2.length + op1.text.length
  } else if (op1.position >= op2.position + op2.length) {
    newOp1.position = op1.position - op2.length
  }

  return [newOp1, newOp2]
}

function transformDeleteAgainstInsert(op1, op2) {
  const newOp1 = { ...op1 }
  const newOp2 = { ...op2 }

  if (op2.position <= op1.position) {
    newOp1.position = op1.position + op2.text.length
  } else if (op2.position > op1.position && op2.position < op1.position + op1.length) {
    newOp1.length = op1.length + op2.text.length
  } else if (op2.position >= op1.position + op1.length) {
    newOp2.position = op2.position - op1.length
  }

  return [newOp1, newOp2]
}

function transformDeleteAgainstDelete(op1, op2) {
  const newOp1 = { ...op1 }
  const newOp2 = { ...op2 }

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

function transformOperations(ops1, ops2) {
  let transformedOps1 = [...ops1]
  let transformedOps2 = [...ops2]

  for (let i = 0; i < transformedOps1.length; i++) {
    for (let j = 0; j < transformedOps2.length; j++) {
      const [newOp1, newOp2] = transform(transformedOps1[i], transformedOps2[j])
      transformedOps1[i] = newOp1
      transformedOps2[j] = newOp2
    }
  }

  return [transformedOps1, transformedOps2]
}

console.log('=== OT 算法简单测试 ===\n')

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
    passed++
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`)
    failed++
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

test('插入操作应用', () => {
  const doc = 'Hello World'
  const op = { type: 'insert', position: 5, text: ', Beautiful' }
  const result = applyOperation(doc, op)
  assert(result === 'Hello, Beautiful World', `Expected 'Hello, Beautiful World', got '${result}'`)
})

test('删除操作应用', () => {
  const doc = 'Hello, Beautiful World'
  const op = { type: 'delete', position: 5, length: 11 }
  const result = applyOperation(doc, op)
  assert(result === 'Hello World', `Expected 'Hello World', got '${result}'`)
})

test('insert vs insert 转换', () => {
  const op1 = { type: 'insert', position: 5, text: 'A' }
  const op2 = { type: 'insert', position: 3, text: 'B' }
  const [newOp1, newOp2] = transform(op1, op2)

  console.log(`  op1: insert at ${op1.position} '${op1.text}'`)
  console.log(`  op2: insert at ${op2.position} '${op2.text}'`)
  console.log(`  newOp1.position: ${newOp1.position}`)
  console.log(`  newOp2.position: ${newOp2.position}`)

  let doc = '123456789'
  doc = applyOperation(doc, op1)
  console.log(`  apply op1 first: '${doc}'`)
  doc = applyOperation(doc, newOp2)
  console.log(`  then apply newOp2: '${doc}'`)

  let doc2 = '123456789'
  doc2 = applyOperation(doc2, op2)
  console.log(`  apply op2 first: '${doc2}'`)
  doc2 = applyOperation(doc2, newOp1)
  console.log(`  then apply newOp1: '${doc2}'`)

  assert(doc === doc2, `Convergence failed: '${doc}' !== '${doc2}'`)
})

test('insert vs delete 转换', () => {
  const insert = { type: 'insert', position: 2, text: 'X' }
  const del = { type: 'delete', position: 5, length: 3 }

  const doc = '0123456789'
  const [newInsert, newDel] = transform(insert, del)

  let result1 = applyOperation(doc, newInsert)
  result1 = applyOperation(result1, newDel)

  let result2 = applyOperation(doc, del)
  result2 = applyOperation(result2, insert)

  assert(result1 === result2, `Convergence failed: '${result1}' !== '${result2}'`)
})

test('delete vs insert 转换', () => {
  const del = { type: 'delete', position: 1, length: 3 }
  const insert = { type: 'insert', position: 5, text: 'XYZ' }

  const doc = '0123456789'
  const [newDel, newInsert] = transform(del, insert)

  let result1 = applyOperation(doc, newDel)
  result1 = applyOperation(result1, newInsert)

  let result2 = applyOperation(doc, insert)
  result2 = applyOperation(result2, del)

  assert(result1 === result2, `Convergence failed: '${result1}' !== '${result2}'`)
})

test('delete vs delete 转换', () => {
  const del1 = { type: 'delete', position: 1, length: 2 }
  const del2 = { type: 'delete', position: 5, length: 2 }

  const doc = '0123456789'
  const [newDel1, newDel2] = transform(del1, del2)

  let result1 = applyOperation(doc, newDel1)
  result1 = applyOperation(result1, newDel2)

  let result2 = applyOperation(doc, del2)
  result2 = applyOperation(result2, del1)

  assert(result1 === result2, `Convergence failed: '${result1}' !== '${result2}'`)
})

test('多操作转换', () => {
  const ops1 = [
    { type: 'insert', position: 0, text: 'Hello ' },
    { type: 'insert', position: 6, text: 'World' }
  ]
  const ops2 = [
    { type: 'insert', position: 0, text: 'Say: ' }
  ]

  const [newOps1, newOps2] = transformOperations(ops1, ops2)

  let result1 = applyOperations('', newOps1)
  result1 = applyOperations(result1, newOps2)

  let result2 = applyOperations('', ops2)
  result2 = applyOperations(result2, ops1)

  assert(result1 === result2, `Convergence failed: '${result1}' !== '${result2}'`)
})

test('真实协作场景', () => {
  let serverDoc = 'Hello World'
  let serverVersion = 0

  const user1Ops = [
    { type: 'insert', position: 0, text: '[' },
    { type: 'insert', position: 12, text: ']' }
  ]
  const user2Ops = [
    { type: 'insert', position: 6, text: 'Awesome ' }
  ]

  const [transformedForUser1, transformedForUser2] = transformOperations(user1Ops, user2Ops)

  serverDoc = applyOperations(serverDoc, user1Ops)
  serverVersion++

  serverDoc = applyOperations(serverDoc, transformedForUser2)
  serverVersion++

  let user1Doc = applyOperations('Hello World', user1Ops)
  user1Doc = applyOperations(user1Doc, transformedForUser2)

  let user2Doc = applyOperations('Hello World', user2Ops)
  user2Doc = applyOperations(user2Doc, transformedForUser1)

  assert(serverDoc === user1Doc, `Server and User1 out of sync: '${serverDoc}' !== '${user1Doc}'`)
  assert(serverDoc === user2Doc, `Server and User2 out of sync: '${serverDoc}' !== '${user2Doc}'`)

  console.log(`  最终文档: "${serverDoc}"`)
})

console.log(`\n=== 测试结果: ${passed} 通过, ${failed} 失败 ===`)

if (failed > 0) {
  process.exit(1)
}
