<template>
  <div class="page">
    <div class="header-row">
      <div>
        <h1>Workflows</h1>
        <p>Create and manage workflow definitions.</p>
      </div>
      <button class="btn" @click="fetchWorkflows">Refresh</button>
    </div>

    <div class="layout">
      <WorkflowForm @created="createWorkflow"></WorkflowForm>

      <div class="list-card">
        <h2>All Workflows</h2>

        <p v-if="loading">Loading workflows...</p>
        <p v-else-if="workflows.length === 0">No workflows found.</p>

        <div v-else class="workflow-list">
          <div v-for="workflow in workflows" :key="workflow._id" class="workflow-item">
            <div>
              <h3>{{ workflow.name }}</h3>
              <p>{{ workflow.description || "NO description" }}</p>
              <small>
                Version: {{  workflow.version }} |
                Active: {{ workflow.isActive ? "Yes" : "No" }}
              </small>
            </div>

            <div class="actions">
              <router-link class="btn secondary" :to="`/workflows/${workflow._id}`">
                Open
              </router-link>
              <button class="btn danger" @click="deleteWorkflow(workflow._id)">
                Delete
              </button>
            </div>  
          </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";
import WorkflowForm from "../components/WorkflowForm.vue";

const workflows = ref([]);
const loading = ref(false);
const error = ref("");
const fetchWorkflows = async () => {
  try {
    loading.value = true;
    error.value = "";
    const response = await api.get("/workflows");
    workflows.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to fetch workflows";
  } finally {
    loading.value = false;
  }
};

const createWorkflow = async (payload) => {
  try {
    error.value = "";
    await api.post("/workflows", payload);
    await fetchWorkflows();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to crete workflow";
  }
};

const deleteWorkflow = async (id) => {
  try {
    error.value = "";
    await api.delete(`/workflows/${id}`);
    await fetchWorkflows();
  } catch (err){
    error.value = err.response?.data?.error || "Failed to delete workflow";
  }
};

onMounted(() => {
  fetchWorkflows();
});
</script>

<style scoped>
.page {
  padding: 24px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
}

.list-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding:20px;
}

.workflow-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 16px;
}

.workflow-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  background: #111827;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
}

.secondary {
  background: #2563eb;
}

.danger {
  background: #dc2626;
}

.error {
  color: #dc2626;
  margin-top: 12px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .workflow-item {
    flex-direction: column;
  }
}
</style>