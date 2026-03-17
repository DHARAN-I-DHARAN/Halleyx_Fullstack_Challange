<template>
  <div class="logs">
    <h3>Execution Logs</h3>

    <div v-if="!execution">No execution selected</div>

    <div v-else>
      <p><strong>Status:</strong> {{ execution.status }}</p>

      <div v-for="(log, index) in execution.logs" :key="index" class="log-card">
        <h4>{{ log.stepName }}</h4>
        <p>Type: {{ log.stepType }}</p>

        <p><strong>Rules Evaluated:</strong></p>
        <ul>
          <li v-for="r in log.evaluatedRules" :key="r.condition">
            {{ r.condition }} → {{ r.result ? "TRUE" : "FALSE" }}
          </li>
        </ul>

        <p>
          <strong>Next Step:</strong>
          {{ log.selectedNextStep || "END" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  execution: Object,
});
</script>

<style scoped>
.log-card {
  border: 1px solid #ddd;
  padding: 12px;
  margin-top: 10px;
  border-radius: 8px;
}
</style>