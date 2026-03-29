<script setup lang="ts">
const props = defineProps<{
  parts: string[],
}>()
</script>

<template>
  <span>
    <code>{{ parts[0] }}</code>:<code>{{ parts[1] }}</code>
    <template v-if="parts[2]">:<code>{{ parts[2] }}</code></template>
    <small>{{ parts[3] ?? '' }}</small>
  </span>
</template>
