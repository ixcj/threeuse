<script setup lang="ts">
import { onMounted } from 'vue'
import { createApp, useSkyBox } from 'threeuse'

const app = createApp({ cameraPosition: [0.74, 4.53, -26.56] })
const scene = app.getScene()

const { value } = useSkyBox(scene)

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
