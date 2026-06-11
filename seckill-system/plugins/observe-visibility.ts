export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('observe-visibility', {
    mounted(el: HTMLElement, binding: any) {
      const callback = binding.value
      
      const index = el.getAttribute('data-index')
      if (index !== null) {
        el.style.setProperty('--index', index)
      }
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(true, entry)
            observer.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      })
      
      observer.observe(el)
      
      ;(el as any)._observer = observer
    },
    unmounted(el: HTMLElement) {
      const observer = (el as any)._observer
      if (observer) {
        observer.disconnect()
      }
    }
  })
})
