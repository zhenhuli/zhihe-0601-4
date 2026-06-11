import { getAllDocuments } from '../../storage/documentStorage'

export default defineEventHandler(() => {
  return getAllDocuments()
})
