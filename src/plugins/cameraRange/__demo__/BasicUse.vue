<script setup lang="ts">
import { onMounted } from 'vue'
import { createApp } from 'threeuse'
import { cameraRange, type CameraRange } from 'threeuse/plugins'
import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  DoubleSide
} from 'three'

const range: CameraRange = {
  x: { min: -499, max: 499 },
  y: { min: -499, max: 499 },
  z: { min: -499, max: 499 },
}

const app = createApp({ cameraPosition: [5, 5, 5] }).use(cameraRange, range)

const geometry = new BoxGeometry(1000, 1000, 1000)
const mats = []
for(let i = 0; i < 6; i++){
  let material = new MeshBasicMaterial({
    color: new Color(Math.random() * 0xffffff),
    side: DoubleSide,
  })
  mats.push(material)
}

const cube = new Mesh(geometry, mats)
app.getScene().add(cube)

onMounted(() => app.mount('#app-container'))
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
