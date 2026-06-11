<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
    <FloatingAppointment />
    <AppointmentModal />
    <SuccessModal />
  </div>
</template>

<script setup lang="ts">
</script>
