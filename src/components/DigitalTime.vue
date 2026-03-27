<script setup lang="ts">
const props = defineProps<{
  parts: string[],
}>()
</script>

<template>
  <span>
    <code>{{ parts[0] }}</code>:<code>{{ parts[1] }}</code>:<code>{{ parts[2] }}</code>
    <small>{{ parts[3] ?? '' }}</small>
  </span>
</template>
