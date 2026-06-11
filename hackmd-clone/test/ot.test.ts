import {
  applyOperation,
  applyOperations,
  transform,
  transformOperations,
  computeOperations,
  invertOperation
} from '../server/ot/operations'
import type { TextOperation, InsertOperation, DeleteOperation } from '../server/ot/operations'

function runTests() {
  console.log('=== 开始 OT 算法测试 ===\n')

  testApplyOperation()
  testTransformInsertAgainstInsert()
  testTransformInsertAgainstDelete()
  testTransformDeleteAgainstInsert()
  testTransformDeleteAgainstDelete()
  testTransformOperations()
  testComputeOperations()
  testInvertOperation()
  testRealWorldScenario()

  console.log('\n=== 所有测试完成 ===')
}

function testApplyOperation() {
  console.log('测试 1: applyOperation')

  const doc = 'Hello World'

  const insertOp: InsertOperation = { type: 'insert', position: 5, text: ', Beautiful' }
  const result1 = applyOperation(doc, insertOp)
  console.assert(result1 === 'Hello, Beautiful World', `插入操作失败: ${result1}`)
  console.log(`  插入操作: "${doc}" → "${result1}" ✓`)

  const deleteOp: DeleteOperation = { type: 'delete', position: 6, length: 10 }
  const result2 = applyOperation(result1, deleteOp)
  console.assert(result2 === 'Hello World', `删除操作失败: ${result2}`)
  console.log(`  删除操作: "${result1}" → "${result2}" ✓`)

  console.log('  ✓ applyOperation 测试通过\n')
}

function testTransformInsertAgainstInsert() {
  console.log('测试 2: transform - insert vs insert')

  const op1: InsertOperation = { type: 'insert', position: 5, text: 'A' }
  const op2: InsertOperation = { type: 'insert', position: 3, text: 'B' }

  const [newOp1, newOp2] = transform(op1, op2)

  console.log(`  op1: 在位置5插入 "A"`)
  console.log(`  op2: 在位置3插入 "B"`)
  console.log(`  转换后 op1.position: ${(newOp1 as InsertOperation).position} (应为6)`)
  console.log(`  转换后 op2.position: ${(newOp2 as InsertOperation).position} (应为3)`)

  console.assert((newOp1 as InsertOperation).position === 6, 'op1 位置转换错误')
  console.assert((newOp2 as InsertOperation).position === 3, 'op2 位置转换错误')

  let doc = '123456789'
  doc = applyOperation(doc, newOp1)
  doc = applyOperation(doc, newOp2)
  console.log(`  应用结果1: ${doc}`)

  let doc2 = '123456789'
  doc2 = applyOperation(doc2, op2)
  doc2 = applyOperation(doc2, op1)
  console.log(`  应用结果2: ${doc2}`)

  console.assert(doc === doc2, `收敛性失败: ${doc} !== ${doc2}`)
  console.log('  ✓ insert vs insert 测试通过\n')
}

function testTransformInsertAgainstDelete() {
  console.log('测试 3: transform - insert vs delete')

  const insert: InsertOperation = { type: 'insert', position: 2, text: 'X' }
  const del: DeleteOperation = { type: 'delete', position: 5, length: 3 }

  const doc = '0123456789'
  console.log(`  初始文档: ${doc}`)
  console.log(`  插入: 在位置2插入 "X"`)
  console.log(`  删除: 从位置5删除3个字符`)

  const [newInsert, newDel] = transform(insert, del)

  let result1 = applyOperation(doc, newInsert)
  result1 = applyOperation(result1, newDel)

  let result2 = applyOperation(doc, del)
  result2 = applyOperation(result2, insert)

  console.log(`  转换后应用: ${result1}`)
  console.log(`  反向应用: ${result2}`)

  console.assert(result1 === result2, `收敛性失败: ${result1} !== ${result2}`)
  console.log('  ✓ insert vs delete 测试通过\n')
}

function testTransformDeleteAgainstInsert() {
  console.log('测试 4: transform - delete vs insert')

  const del: DeleteOperation = { type: 'delete', position: 1, length: 3 }
  const insert: InsertOperation = { type: 'insert', position: 5, text: 'XYZ' }

  const doc = '0123456789'
  console.log(`  初始文档: ${doc}`)
  console.log(`  删除: 从位置1删除3个字符`)
  console.log(`  插入: 在位置5插入 "XYZ"`)

  const [newDel, newInsert] = transform(del, insert)

  let result1 = applyOperation(doc, newDel)
  result1 = applyOperation(result1, newInsert)

  let result2 = applyOperation(doc, insert)
  result2 = applyOperation(result2, del)

  console.log(`  转换后应用: ${result1}`)
  console.log(`  反向应用: ${result2}`)

  console.assert(result1 === result2, `收敛性失败: ${result1} !== ${result2}`)
  console.log('  ✓ delete vs insert 测试通过\n')
}

function testTransformDeleteAgainstDelete() {
  console.log('测试 5: transform - delete vs delete')

  const del1: DeleteOperation = { type: 'delete', position: 1, length: 2 }
  const del2: DeleteOperation = { type: 'delete', position: 5, length: 2 }

  const doc = '0123456789'
  console.log(`  初始文档: ${doc}`)
  console.log(`  del1: 从位置1删除2个字符 ("12")`)
  console.log(`  del2: 从位置5删除2个字符 ("56")`)

  const [newDel1, newDel2] = transform(del1, del2)

  let result1 = applyOperation(doc, newDel1)
  result1 = applyOperation(result1, newDel2)

  let result2 = applyOperation(doc, del2)
  result2 = applyOperation(result2, del1)

  console.log(`  转换后应用: ${result1}`)
  console.log(`  反向应用: ${result2}`)

  console.assert(result1 === result2, `收敛性失败: ${result1} !== ${result2}`)
  console.log('  ✓ delete vs delete 测试通过\n')
}

function testTransformOperations() {
  console.log('测试 6: transformOperations - 多个操作')

  const ops1: TextOperation[] = [
    { type: 'insert', position: 0, text: 'Hello ' },
    { type: 'insert', position: 6, text: 'World' }
  ]

  const ops2: TextOperation[] = [
    { type: 'insert', position: 0, text: 'Say: ' }
  ]

  const doc = ''
  console.log(`  ops1: 插入 "Hello ", 然后插入 "World"`)
  console.log(`  ops2: 插入 "Say: "`)

  const [newOps1, newOps2] = transformOperations(ops1, ops2)

  let result1 = applyOperations(doc, newOps1)
  result1 = applyOperations(result1, newOps2)

  let result2 = applyOperations(doc, ops2)
  result2 = applyOperations(result2, ops1)

  console.log(`  转换后应用: "${result1}"`)
  console.log(`  反向应用: "${result2}"`)

  console.assert(result1 === result2, `收敛性失败: "${result1}" !== "${result2}"`)
  console.log('  ✓ transformOperations 测试通过\n')
}

function testComputeOperations() {
  console.log('测试 7: computeOperations - 差异计算')

  const testCases = [
    { old: 'Hello World', new: 'Hello Beautiful World' },
    { old: 'Hello World', new: 'Hello' },
    { old: 'abcdef', new: 'aXbYcdef' },
    { old: '', new: 'Hello' },
    { old: 'Hello', new: '' },
    { old: 'Quick brown fox', new: 'Quick red fox' }
  ]

  for (const { old: oldText, new: newText } of testCases) {
    const operations = computeOperations(oldText, newText)
    const result = applyOperations(oldText, operations)

    console.log(`  "${oldText}" → "${newText}"`)
    console.log(`    操作数: ${operations.length}`)
    operations.forEach((op, i) => {
      if (op.type === 'insert') {
        console.log(`    ${i}: insert at ${op.position}: "${op.text}"`)
      } else {
        console.log(`    ${i}: delete at ${op.position}: ${op.length} chars`)
      }
    })
    console.log(`    应用结果: "${result}"`)

    console.assert(result === newText, `差异计算失败: "${result}" !== "${newText}"`)
  }

  console.log('  ✓ computeOperations 测试通过\n')
}

function testInvertOperation() {
  console.log('测试 8: invertOperation - 操作反转')

  const doc = 'Hello World'

  const insertOp: InsertOperation = { type: 'insert', position: 5, text: ', Beautiful' }
  const modified = applyOperation(doc, insertOp)
  const invertedInsert = invertOperation(insertOp, doc)
  const restored1 = applyOperation(modified, invertedInsert)

  console.log(`  插入反转: "${doc}" → "${modified}" → "${restored1}"`)
  console.assert(restored1 === doc, '插入反转失败')

  const deleteOp: DeleteOperation = { type: 'delete', position: 5, length: 6 }
  const modified2 = applyOperation(doc, deleteOp)
  const invertedDelete = invertOperation(deleteOp, doc)
  const restored2 = applyOperation(modified2, invertedDelete)

  console.log(`  删除反转: "${doc}" → "${modified2}" → "${restored2}"`)
  console.assert(restored2 === doc, '删除反转失败')

  console.log('  ✓ invertOperation 测试通过\n')
}

function testRealWorldScenario() {
  console.log('测试 9: 真实协作场景')

  let serverDoc = 'Hello World'
  let serverVersion = 0

  const user1Ops: TextOperation[] = [
    { type: 'insert', position: 0, text: '[' },
    { type: 'insert', position: 12, text: ']' }
  ]

  const user2Ops: TextOperation[] = [
    { type: 'insert', position: 6, text: 'Awesome ' }
  ]

  console.log(`  初始文档 (v${serverVersion}): "${serverDoc}"`)
  console.log(`  用户1: 在首尾添加 []`)
  console.log(`  用户2: 在位置6插入 "Awesome "`)

  const [transformedForUser1, transformedForUser2] = transformOperations(user1Ops, user2Ops)

  serverDoc = applyOperations(serverDoc, user1Ops)
  serverVersion++
  console.log(`  应用用户1操作后 (v${serverVersion}): "${serverDoc}"`)

  serverDoc = applyOperations(serverDoc, transformedForUser2)
  serverVersion++
  console.log(`  应用转换后用户2操作后 (v${serverVersion}): "${serverDoc}"`)

  let user1Doc = applyOperations('Hello World', user1Ops)
  user1Doc = applyOperations(user1Doc, transformedForUser2)
  console.log(`  用户1文档: "${user1Doc}"`)

  let user2Doc = applyOperations('Hello World', user2Ops)
  user2Doc = applyOperations(user2Doc, transformedForUser1)
  console.log(`  用户2文档: "${user2Doc}"`)

  console.assert(serverDoc === user1Doc, `服务器与用户1不同步: "${serverDoc}" !== "${user1Doc}"`)
  console.assert(serverDoc === user2Doc, `服务器与用户2不同步: "${serverDoc}" !== "${user2Doc}"`)

  console.log('  ✓ 真实协作场景测试通过\n')
}

runTests()
