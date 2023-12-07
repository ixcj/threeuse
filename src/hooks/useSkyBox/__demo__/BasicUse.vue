<script setup lang="ts">
import { onMounted } from 'vue'
import { createApp, useRenderClock } from 'threeuse'
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three'

const app = createApp()
const scene = app.getScene()
const camera = app.getCamera()

onMounted(() => {
  app.mount('#app-container')

  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new Mesh( geometry, material )
  scene.add(cube)

  camera.position.z = 5;

  useRenderClock((d) => {
    const rotation = d / 1000
    cube.rotation.x += rotation
    cube.rotation.y += rotation
  })
})
</script>

<template>
  <div id="app-container"></div>
</template>

<style lang="scss" scoped>
#app-container {
  width: 100%;
  height: 300px;
}
</style>
