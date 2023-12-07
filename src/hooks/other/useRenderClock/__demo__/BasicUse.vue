<script setup lang="ts">
import { ref } from 'vue'
import { useRenderClock } from 'threeuse'

const fps = ref(0)

const { start } = useRenderClock((d) => {
  fps.value = Math.round(1000 / d)
})
</script>

<template>
  <div>
    屏幕帧率：<span>{{ fps }}</span>
    <div class="btn-box">
      <button @click="start = !start">{{ start ? '暂停' : '开始' }}</button>
    </div>
  </div>
</template>
