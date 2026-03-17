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
            <label for="rule-condition">Condition</label>
            <input 
            type="text" 
            id="rule-condition" 
            v-model="form.condition"
            placeholder="amount > 100 && country === 'US' OR DEFAULT" 
            required />
        </div>

        <div class="form-group">
            <label for="rule-priority">priority</label>
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
    condition: "",
    priority: 1,
    nextStep: null,
});

const handleSubmit = () => {
    emit("created", {
        stepId: form.stepId,
        payload: {
            condition: form.condition,
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

</style>