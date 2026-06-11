import { updateDocument } from '../../storage/documentStorage'
import type { DocumentUpdate } from '../../types/document'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '文档ID不能为空'
    })
  }

  const body = await readBody<DocumentUpdate>(event)
  const doc = updateDocument(id, body)
  
  if (!doc) {
    throw createError({
      statusCode: 404,
      message: '文档不存在'
    })
  }

  return doc
})
