import { initStorage } from '../storage/documentStorage'

export default defineNitroPlugin(() => {
  initStorage()
  console.log('Document storage initialized')
})
