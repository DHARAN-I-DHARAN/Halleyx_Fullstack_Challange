<template>
  <div class="page">

    <div class="header-row">
      <div>
        <h1>{{ workflow?.name || "Workflow Details" }}</h1>
        <p>{{ workflow?.description || "No description" }}</p>
      </div>
      <router-link class="btn secondary" to="/workflows">Back</router-link>
    </div>

    <div class="Summary-card" v-if="workflow">
      <p><strong>Version:</strong> {{ workflow.version }}</p>
      <p><strong>Active:</strong>{{ workflow.isActive ? "Yes" : "No"}}</p>

      <div class="start-step-row">
        <label for="start-step"><strong>Start Step:</strong></label>
        <select id="start-step" v-model="selectedStartStep">
          <option disabled value="">Select start step</option>
          <option v-for="step in steps" :key="step._id" :value="step._id">
            {{ step.name }}
          </option>
        </select>
        <button class="btn" @click="updateStartStep">Save Start Step</button>
      </div>
    </div>

    <div class="layout">

      <div class="left-column">
        <StepForm @created="createStep" />
        <RuleForm :steps="steps" @created="createRule" />
      </div>

      <div class="right-column">

        <div class="list-card">
          <h2>Steps</h2>
          <p v-if="steps.length === 0">No steps added yet.</p>

          <div v-else class="step-list">
            <div v-for="step in steps" :key="step._id" class="step-item">
              <div class="step-header">
                <div>
                  <h3>{{ step.name }}</h3>
                  <p>Type: {{ step.stepType }} | Order: {{ step.order }}</p>
                  <small>
                    Assignee: {{ step.metadata?.assigneeEmail || "Not set" }}
                  </small>
                </div>
              </div>

              <div class="rules-box">
                <h4>Rules</h4>
                <p v-if="getRulesForStep(step._id).length === 0">No rules for this step. </p>

                <div v-for="rule in getRulesForStep(step._id)" :key="rule.id" class="rule-item" >
                  <p><strong>Condition: </strong>{{ rule.condition }}</p>
                  <p><strong>Priority: </strong>{{ rule.priority }}</p>
                  <p><strong>Next Step: </strong>{{ getStepName(rule.nextStep || "End workflow") }}
                  </p>
                  <div class="rule-actions">
                  <button class="btn secondary" @click="editRule(rule)">Edit</button>
                  <button class="btn danger" @click="deleteRule(rule._id)">Delete</button>
                </div>
                </div>

              </div>

            </div>
          </div>

          <p v-if="error" class="error"> {{ error }}</p>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";
import StepForm from "../components/StepForm.vue";
import RuleForm from "../components/RuleForm.vue";

import { useRoute } from "vue-router";

const route = useRoute();
const workflowId = route.params.id;

const props = defineProps({
  id: String
});

console.log(props.id);
const workflow = ref(null);
const steps = ref([]);
const rules = ref([]);
const error = ref("");
const selectedStartStep = ref("");

const fetchWorkflowDetails = async () => {
  try {
    error.value = "";
    const response = await api.get(`/workflows/${workflowId}`);
    workflow.value = response.data.workflow || response.data;
    steps.value = response.data.steps || [];
    rules.value = response.data.rules || [];
    selectedStartStep.value = workflow.value.startStep || "";
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to load workflow details";
  }
};

const createStep = async (payload) => {
  try {
    error.value = "";
    await api.post(`/steps/workflow/${workflowId}`, payload);
    await fetchWorkflowDetails();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to create step";
  }
};

const createRule = async ({ stepId, payload }) => {
  try {
    error.value = "";
    await api.post(`/rules/step/${stepId}`, payload);
    await fetchWorkflowDetails();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to create rule";
  }
};

const deleteRule = async (ruleId) => {
  try {
    await api.delete(`/rules/${ruleId}`);
    await fetchWorkflowDetails(); 
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to delete rule";
  }
};

const editRule = (rule) => {
  const condition = prompt("Enter condition:", rule.condition);
  const priority = prompt("Enter priority:", rule.priority);

  if (!condition || !priority) return;

  updateRule(rule._id, {
    condition,
    priority: Number(priority),
    nextStep: rule.nextStep,
  });
};

const updateStartStep = async () => {
  try {
    error.value = "";
    await api.put(`/workflows/${workflowId}`, {
      startStep: selectedStartStep.value,
    });
    await fetchWorkflowDetails();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to update start step";
  }
};

const updateRule = async (ruleId, updatedData) => {
  try {
    await api.put(`/rules/${ruleId}`, updatedData);
    await fetchWorkflowDetails();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to update rule";
  }
};

const getRulesForStep =(stepId) =>  {
  return rules.value.filter((rule) => {
    const ruleStepId = typeof rule.step === "object" && rule.step !== null ? rule.step.id : rule.step;
    return ruleStepId === stepId;
  });
};

const getStepName = (stepId) => {
  const found = steps.value.find((step) => step._id === stepId );
  return found ? found.name : null;
};

onMounted(() => {
  fetchWorkflowDetails();
  
});

</script>

<style scoped>

.page {
  padding: 24px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.summary-card ,
.list-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.start-step-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 14px;
  margin-bottom:10px;
  flex-wrap: wrap;
}

.start-step-row select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.layout{
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.rules-box {
  margin-top: 12px;
  padding-top:12px;
  border-top: 1px solid #eee;
}

.rule-item {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin-top: 10px;
}

.rule-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  background: #111827;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
}

.secondary {
  background: #2563eb;
}

.error {
  color: #dc2626;
  margin-top: 12px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

</style>