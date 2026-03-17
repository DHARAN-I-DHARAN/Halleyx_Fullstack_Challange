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
      <input v-model.number="form.amount" type="number" min="0" required />
    </div>

    <div class="form-group">
      <label>Country</label>
      <select v-model="form.country" required>
        <option disabled value="">Select country</option>
        <option value="US">USA</option>
        <option value="IN">INDIA</option>
        <option value="UK">UK</option>
        <option value="CA">CANADA</option>
      </select>  
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
  justify-content: space-between;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  margin-top: 10px;
  gap: 8px;
}
.form-group label {
  font-weight: 500;
  font-size: 14px;
  color:#111;
}
.form-group select ,
.form-group input[type="number"]{
  padding: 10px 12px;
  border: 2px solid #333;      
  border-radius: 6px;
  font-size: 14px;
  color: #111;
  background-color: #fff;
}
.form-group select {  
  cursor: pointer;
  outline: none;
  appearance: none;             
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
.form-group select:focus,
.form-group input[type="number"]:focus {
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}
.btn {
  background: #111827;
  color: white;
  padding: 10px;
  border-radius: 6px;
}

</style>