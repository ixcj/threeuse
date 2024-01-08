<script setup lang="ts">
import { onMounted } from 'vue'
import { createApp, useRenderClock, useSkyBox } from 'threeuse'
import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  PlaneGeometry,
} from 'three'

const app = createApp({ cameraPosition: [0.74, 4.53, -26.56] })
const scene = app.getScene()

const geometry = new BoxGeometry(1, 1, 1)
const mats = []
for(let i = 0; i < 6; i++){
  let material = new MeshBasicMaterial({ color: new Color(Math.random() * 0xffffff)})
  mats.push(material)
}

const cube = new Mesh(geometry, mats)
cube.name = 'cube'
cube.position.setY(1)
scene.add(cube)

const floorGeo = new PlaneGeometry(2000, 2000, 1, 1)
const floorMaterial = new MeshBasicMaterial({ color: '#aaaaaa' })
const floor = new Mesh(floorGeo, floorMaterial)
floor.rotateX(Math.PI / -2)
scene.add(floor)

app.getRenderer().shadowMap.enabled = true
const { value } = useSkyBox(scene, {
  castShadowList: ['cube']
})

useRenderClock((d) => {
  const rotation = d / 1000
  cube.rotation.x += rotation
  cube.rotation.y += rotation
})

onMounted(() => app.mount('#app-container'))
</script>

<template>
  <div id="app-container">
    <div class="time-box">
      <div>{{ value }}</div>
      <input type="range" v-model="value" min="0" max="720">
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app-container {
  width: 100%;
  height: 500px;
  position: relative;

  .time-box {
    width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    position: absolute;
    right: 0;
    background-color: rgba(255, 255, 255,0.75);
  }
}
</style>
