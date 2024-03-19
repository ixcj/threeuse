<script setup lang="ts">
import { onMounted } from 'vue'
import { createApp } from 'threeuse'
import { stats } from 'threeuse/plugins'
import { useRenderClock } from 'threeuse/expands'
import { BoxGeometry, MeshBasicMaterial, Mesh, Color } from 'three'

const app = createApp({ cameraPosition: [3, 3, 3] }).use(stats)

const geometry = new BoxGeometry(1, 1, 1)
const mats = []
for(let i = 0; i < 6; i++){
  let material = new MeshBasicMaterial({ color: new Color(Math.random() * 0xffffff)})
  mats.push(material)
}

const cube = new Mesh(geometry, mats)
app.getScene().add(cube)

useRenderClock((d) => {
  const rotation = d / 1000
  cube.rotation.x += rotation
  cube.rotation.y += rotation
})

onMounted(() => app.mount('#app-container'))
</script>

<template>
  <div id="app-container"></div>
</template>

<style lang="scss" scoped>
#app-container {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>
