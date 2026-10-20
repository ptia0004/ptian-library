<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()

const showHeader = computed(() => {
  return !['CountBookAPI', 'GetAllBookAPI'].includes(route.name)
})
</script>

<template>
  <div class="main-container">
    <header v-if="showHeader">
      <BHeader />
    </header>

    <main class="main-box">
      <RouterView />
    </main>
  </div>
</template>

<style>
.main-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
}

.main-box {
  width: 100%;
}
</style>
