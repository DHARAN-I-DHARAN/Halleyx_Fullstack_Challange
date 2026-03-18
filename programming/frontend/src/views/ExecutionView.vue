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
        <div class="log-box list-card">
          <ExecutionLogViewer :execution="selectedExecution" :key="selectedExecutionId" />
        </div>
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
const selectedExecutionId = ref(null);
const selectedExecution = ref(null);

const fetchWorkflows = async () => {
  const res = await api.get("/workflows");
  workflows.value = res.data.workflows;
};

const fetchExecutions = async () => {
  const res = await api.get("/executions");
  executions.value = res.data;
};

const runExecution = async ({ workflowId, input }) => {
  try {
    const res = await api.post(`/executions/workflow/${workflowId}`, input);

    selectedExecutionId.value = res.data._id; 
    selectedExecution.value = res.data;

    alert("Execution started successfully");

    fetchExecutions();
  } catch (error) {
    console.error(error);
    alert("Execution failed");
  }
};

const viewExecution = async (exec) => {
  try {
    selectedExecutionId.value = exec._id; 

    const res = await api.get(`/executions/${exec._id}`);

    selectedExecution.value = res.data;
  } catch (error) {
    console.error(error);
    alert("Failed to load execution");
  }
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
.h3{
  font-weight: 100;
}
.page {
  padding: 24px;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}
.layout {
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
.log-box{
  margin-top: 20px;
}
.list-card {
  width:100%;
}

</style>