<template>
  <form class="form-card" @submit.prevent="handleSubmit">
    <h3>Start Execution</h3>

    <div class="form-group">
      <label>Workflow</label>
      <select v-model="selectedWorkflow" required>
        <option disabled value="">Select workflow</option>
        <option v-for="wf in workflows" :key="wf._id" :value="wf._id">
          {{ wf.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>Amount</label>
      <input v-model.number="form.amount" type="number" required />
    </div>

    <div class="form-group">
      <label>Country</label>
      <input v-model="form.country" type="text" required />
    </div>

    <div class="form-group">
      <label>Priority</label>
      <select v-model="form.priority">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>

    <button class="btn">Run Workflow</button>
  </form>
</template>

<script setup>

import { reactive, ref } from "vue";

defineProps({
  workflows: Array,
});

const emit = defineEmits(["run"]);

const selectedWorkflow = ref("");

const form = reactive({
  amount: 0,
  country: "",
  priority: "Low",
});

const handleSubmit = () => {
  emit("run", {
    workflowId: selectedWorkflow.value,
    input: { ...form },
  });
};
</script>

<style scoped>
.form-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}
.btn {
  background: #111827;
  color: white;
  padding: 10px;
  border-radius: 6px;
}
</style>