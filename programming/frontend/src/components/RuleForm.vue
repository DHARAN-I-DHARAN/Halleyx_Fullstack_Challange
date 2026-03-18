<template>
    <form class="form-card" @submit.prevent="handleSubmit">
        <h3>Add Rule</h3>

        <div class="form-group">
            <label for="rule-step">Step</label>
            <select id="rule-step" v-model="form.stepId" required>
                <option disabled value="">Select Step</option>
                <option v-for="step in steps" :key="step._id" :value="step._id">
                    {{ step.name }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label>Conditions</label>

            <div v-for="(cond, index) in form.conditions" :key="index" class="condition-row">
                
                <select v-model="cond.field">
                    <option value="amount">Amount</option>
                    <option value="country">Country</option>
                    <option value="priority">Priority</option>
                </select>

                <select v-model="cond.operator">
                    <option value=">">></option>
                    <option value="<"><</option>
                    <option value="===">=</option>
                </select>

                <input v-model="cond.value" placeholder="Value" />
               
                <button type="button" @click="removeCondition(index)">❌</button>

            </div>

            <button type="button" @click="addCondition">+ Add Condition</button>
        </div>

        <div class="form-group">
            <label for="rule-priority">Priority</label>
            <input type="number" id="rule-priority" v-model.number="form.priority" min="1" required />
        </div>

        <div class="form-group">
            <label for="rule-next-step">Next Step</label>
            <select id="rule-next-step" v-model="form.nextStep" >
                <option :value="null">End Workflow</option>
                <option v-for="step in steps" :key="step._id" :value="step._id">
                    {{ step.name }}
                </option>
            </select>
        </div>

        <button class="btn" type="submit">Add Rule</button>
    </form>
</template>

<script setup>

import { reactive } from "vue";

defineProps({
    steps: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["created"]);

const form = reactive({
  stepId: "",
  conditions: [
    {
      field: "amount",
      operator: ">",
      value: "",
    },
  ],
  priority: 1,
  nextStep: null,
});

const buildCondition = () => {
  if (
    form.conditions.length === 1 &&
    form.conditions[0].value === "DEFAULT"
  ) {
    return "DEFAULT";
  }

  const parts = form.conditions.map((cond) => {
    if (cond.field === "country" || cond.field === "priority") {
      return `${cond.field} === '${cond.value}'`;
    }
    return `${cond.field} ${cond.operator} ${cond.value}`;
  });

  return parts.join(" && ");
};

const addCondition = () => {
  form.conditions.push({
    field: "amount",
    operator: ">",
    value: "",
  });
};

const removeCondition = (index) => {
  form.conditions.splice(index, 1);
};

const handleSubmit = () => {
    emit("created", {
        stepId: form.stepId,
        payload: {
            condition: buildCondition(),
            priority: form.priority,
            nextStep: form.nextStep || null,
        },
    });

    form.stepId = "";
    form.condition = "";
    form.priority = 1;
    form.nextStep = null;
};

</script>

<style scoped>

.form-card{
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
}

.form-group label {
    margin-bottom: 6px;
    font-weight: 600;
}

.form-group input,
.form-group select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.btn {
    background: #111827;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
}

.condition-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.condition-row input,
.condition-row select {
  padding: 6px;
}

</style>