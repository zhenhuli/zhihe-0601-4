import { getDocumentById } from '../../storage/documentStorage'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '文档ID不能为空'
    })
  }

  const doc = getDocumentById(id)
  
  if (!doc) {
    throw createError({
      statusCode: 404,
      message: '文档不存在'
    })
  }

  return doc
})
