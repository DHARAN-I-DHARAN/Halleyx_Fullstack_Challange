<template>
  <div class="page">
    <h1>Executions</h1>

    <div class="layout">
      <ExecutionForm :workflows="workflows" @run="runExecution" />

      <div class="right">
        <div class="list-card">
          <h3>Execution History</h3>

          <div v-for="exec in executions" :key="exec._id" class="exec-item">
            <div>
              <p><strong>ID:</strong> {{ exec._id }}</p>
              <p>Status: {{ exec.status }}</p>
            </div>

            <div class="actions">
              <button class="btn" @click="viewExecution(exec)">View</button>
              <button class="btn secondary" @click="retry(exec._id)">Retry</button>
            </div>
          </div>
        </div>

        <ExecutionLogViewer :execution="selectedExecution" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";
import ExecutionForm from "../components/ExecutionForm.vue";
import ExecutionLogViewer from "../components/ExecutionLogViewer.vue";

const workflows = ref([]);
const executions = ref([]);
const selectedExecution = ref(null);

const fetchWorkflows = async () => {
  const res = await api.get("/workflows");
  workflows.value = res.data;
};

const fetchExecutions = async () => {
  const res = await api.get("/executions");
  executions.value = res.data;
};

const runExecution = async ({ workflowId, input }) => {
  const res = await api.post(`/executions/workflow/${workflowId}`, input);
  selectedExecution.value = res.data;
  fetchExecutions();
};

const viewExecution = async (exec) => {
  const res = await api.get(`/executions/${exec._id}`);
  selectedExecution.value = res.data;
};

const retry = async (id) => {
  await api.post(`/executions/${id}/retry`);
  fetchExecutions();
};

onMounted(() => {
  fetchWorkflows();
  fetchExecutions();
});
</script>

<style scoped>
.page {
  padding: 24px;
}
.layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
}
.exec-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.btn {
  background: black;
  color: white;
  padding: 6px 10px;
}
.secondary {
  background: blue;
}
</style>