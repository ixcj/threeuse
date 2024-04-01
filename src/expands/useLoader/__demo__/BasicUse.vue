<script setup lang="ts">
import { onMounted } from 'vue'
import { createThreeUseApp, useSkyBox } from 'threeuse'
import { useLoader } from 'threeuse/expands'
import { AmbientLight } from 'three'

const app = createThreeUseApp({ cameraPosition: [5, 5, 5] })
const scene = app.getScene()
const ambientLight = new AmbientLight(0xffffff, 5);
scene.add(ambientLight)

useSkyBox(scene, {
  defaultValue: 160,
})

const { loading, loader } = useLoader([
  {
    name: 'fox',
    type: 'gltf',
    path: new URL('@/assets/model/fox.glb', import.meta.url).href
  }
], { enableDracoLoader: true })

async function load() {
  const foxModel = scene.getObjectByName('fox')
  if (loading.value || foxModel) return

  const [fox] = await loader.load('fox')
  fox.scene.position.set(Math.random(), Math.random(), Math.random())
  scene.add(fox.scene)
}

onMounted(async () => {
  app.mount('#app-container')
})
</script>

<template>
  <div id="app-container">
    <div class="loading" v-if="loading">加载中~</div>
  </div>
  <div class="btn-box" style="margin-top: 5px;">
    <button @click="load">加载资源</button>
  </div>
</template>

<style lang="scss" scoped>
#app-container {
  width: 100%;
  height: 500px;
  position: relative;

  .loading {
    position: absolute;
    inset: 0;
    background-color: rgba($color: #000, $alpha: 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>
