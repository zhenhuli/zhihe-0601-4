import { getSnapshots } from '../../../storage/documentStorage'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '文档ID不能为空'
    })
  }

  const snapshots = getSnapshots(id)
  return { snapshots }
})
