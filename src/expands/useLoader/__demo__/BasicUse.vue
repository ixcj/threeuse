<script setup lang="ts">
import { onMounted } from 'vue'
import { createApp } from 'threeuse'
import { useLoader } from 'threeuse/expands'

const app = createApp({ cameraPosition: [0, 0, 0] })
const loader = useLoader([
  {
    name: 'fox',
    type: 'gltf',
    path: new URL('@/assets/model/House_001_GLB.glb', import.meta.url).href
  }
])

onMounted(() => {
  app.mount('#app-container')

  loader.load('fox')
  const fox = loader.get('fox')

  console.log(fox)
})
</script>

<template>
  <div id="app-container"></div>
</template>

<style lang="scss" scoped>
#app-container {
  width: 100%;
  height: 500px;
  position: relative;
}
</style>
