<template lang="">
  <div>
    <el-input size="large"></el-input>
    <el-input size="small"></el-input>
    <el-input></el-input>
    <el-input showPassword></el-input>

    <el-input>
      <template #prefix>
      </template>
    </el-input>
    <el-input showClear></el-input>

  </div>
</template>
<script setup lang="ts">
import ElInput from '../../components/Input/Input.vue'
import ElIcon from '../../components/Icon/Icon.vue'
import { ref } from 'vue' 
defineOptions({
  name: 'InputView'
})

let inputValue = ref('123')
</script>
<style lang="">
  
</style>