<template>
  <div>

    <el-button @click="open('success')" type="success"> Success </el-button>
    <el-button @click="open('info')" type="info"> Info </el-button>
    <el-button @click="open('warning')" type="warning"> warning </el-button>
    <el-button @click="open('error')" type="danger"> Danger </el-button>

  </div>
</template>
<script setup lang="ts">
import ElButton from '../../components/Button/Button.vue'
import { createMessage } from '@/components/Message/method'

const open = (type: any) => {
  createMessage({
    message: 'message消息提示', type, onClose: () => {
    },showClose: true
  })
}
defineOptions({
  name: 'MessageView'
})

</script>
<style lang="">

</style>