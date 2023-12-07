<script setup lang="ts">
import { useRollingData } from 'threeuse'

const data = [...new Array(100).keys()]

const { displayData, start, index } = useRollingData<number>(data)
</script>

<template>
  <div>
    <div class="btn-box">
      <button @click="start = !start">{{ start ? '暂停' : '开始' }}</button>
      <button @click="index = 50">跳转到第50项</button>
    </div>
    <p>{{ displayData }}</p>
  </div>
</template>
