<script setup lang="ts">
import Versions from './components/Versions.vue'

import {ref, reactive, watch} from 'vue'

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
  <!--  <Versions></Versions>-->
<!--  <div class="links">-->
<!--    <iframe v-if="(showBit & 1) === 1" src="https://www.baidu.com" title="baidu"></iframe>-->
<!--    <iframe v-if="(showBit & 2) === 2" src="https://www.360.com" title="360"></iframe>-->
<!--  </div>-->
  <div class="features">
    <button class="feature-item" @click="showBit = 1">打开百度</button>
    <button class="feature-item" @click="showBit = 2">打开360</button>
    <button class="feature-item" @click="showBit = 3">打开百度和360</button>
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';


</style>
