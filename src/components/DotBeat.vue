<script setup lang="ts">
const props = defineProps<{
  parts: string[],
}>()
</script>

<template>
  <span>@<code>{{ parts[0] }}</code><template v-if="parts[1]">.<code>{{ parts[1] }}</code></template></span>
</template>
