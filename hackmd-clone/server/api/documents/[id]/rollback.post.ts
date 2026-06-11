import { rollbackToSnapshot, rollbackToVersion } from '../../../storage/documentStorage'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '文档ID不能为空'
    })
  }

  let updatedDoc = null

  if (body.snapshotId) {
    updatedDoc = rollbackToSnapshot(id, body.snapshotId)
  } else if (body.version !== undefined) {
    updatedDoc = rollbackToVersion(id, body.version)
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: '必须提供 snapshotId 或 version'
    })
  }

  if (!updatedDoc) {
    throw createError({
      statusCode: 404,
      statusMessage: '回滚失败，快照不存在'
    })
  }

  return { document: updatedDoc }
})
