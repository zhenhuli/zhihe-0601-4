import { createDocument } from '../../storage/documentStorage'
import type { DocumentCreate } from '../../types/document'

export default defineEventHandler(async (event) => {
  const body = await readBody<DocumentCreate>(event)
  
  if (!body.title) {
    throw createError({
      statusCode: 400,
      message: '标题不能为空'
    })
  }

  return createDocument(body)
})
