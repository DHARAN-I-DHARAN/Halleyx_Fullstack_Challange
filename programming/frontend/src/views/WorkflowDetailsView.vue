<template>
  <div class="page">
    <h1>Workflow Details</h1>
    <p>Workflow ID:</p>
    <p>Workflow info, steps, and rules.</p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.page {
  padding: 24px;
}
</style>