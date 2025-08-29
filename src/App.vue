<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 应用启动时检查认证状态
onMounted(() => {
  authStore.checkAuthStatus()
})
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
}
</style>