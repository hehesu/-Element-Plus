<template lang="">
  <div>
    <el-button type="primary" circle  icon="edit">1111</el-button>
    <el-button type="danger" loading>aaa</el-button>
    <el-button type="success">aaa</el-button>
    <el-icon icon="edit" ></el-icon>
    <el-icon icon="arrow-right" color="blue"></el-icon>
    <el-icon icon="user" size="2x"></el-icon>
    <el-icon icon="user" rotation="180"></el-icon>
  </div>
</template>
<script setup lang="ts">
import ElButton from '@/components/Button/Button.vue'
import ElIcon from '@/components/Icon/Icon.vue'
defineOptions({
  name: 'ButtonView'
})
</script>
<style lang="">
  
</style>