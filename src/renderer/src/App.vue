<script setup lang="ts">

import {ref, watch} from 'vue'

const showBit = ref(0)
// 一个用法走天下
watch(
  showBit,
  (newValue, oldValue) => {
    console.log('监听了整个对象 ', newValue, oldValue)
    window.ipcRenderer.send('showEvent', showBit.value);
  }
)
</script>

<template>
  <div class="features">
    <button class="feature-item" @click="showBit = 1">打开百度</button>
    <button class="feature-item" @click="showBit = 2">打开360</button>
    <button class="feature-item" @click="showBit = 3">打开百度和360</button>
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';


</style>
