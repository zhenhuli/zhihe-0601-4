export default defineNuxtPlugin(() => {
  const activityStore = useActivityStore()
  activityStore.initActivity()

  const userStore = useUserStore()
  const orderStore = useOrderStore()
  userStore.initUser()
  orderStore.initOrders()
})
