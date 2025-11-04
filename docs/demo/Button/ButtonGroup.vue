<template>
  <div class="basic block">
    <ButtonGroup>
      <Button type="primary">Previous Page</Button>
      <Button type="primary">
        Next Page
        <Icon icon="arrow-right" />
      </Button>
    </ButtonGroup>
  </div>
</template>
<script setup>
import Button from '@/components/Button/Button.vue'
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup.vue'
import Icon from '@/components/Icon/Icon.vue'
</script>