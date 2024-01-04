<script setup lang="ts">
import { ref } from 'vue'
import { useRenderClock } from 'threeuse'

const fps = ref(0)
const max = ref(0)

const { start } = useRenderClock((d) => {
  fps.value = Math.round(1000 / d)
  if (fps.value > max.value) max.value = fps.value
})
</script>

<template>
  <div>
    屏幕帧率：<span>{{ fps }}</span>
    <div class="btn-box">{{ max }}
      <button @click="start = !start">{{ start ? '暂停' : '开始' }}</button>
    </div>
  </div>
</template>
