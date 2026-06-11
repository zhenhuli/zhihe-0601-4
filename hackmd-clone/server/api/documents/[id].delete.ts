import { deleteDocument } from '../../storage/documentStorage'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '文档ID不能为空'
    })
  }

  const success = deleteDocument(id)
  
  if (!success) {
    throw createError({
      statusCode: 404,
      message: '文档不存在'
    })
  }

  return { success: true }
})
