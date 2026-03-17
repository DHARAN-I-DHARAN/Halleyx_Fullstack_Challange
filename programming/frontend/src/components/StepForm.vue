<template>
    <form class="form-card" @submit.prevent="handleSubmit">
        <h3>Add Step</h3>

        <div class="form-group">
            <label for="step-name">Name</label>
            <input id="step-name" v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
            <label for="step-type">Step Type</label>
            <select id="step-type" v-model="form.stepType" required>
                <option value="approval">approval</option>
                <option value="notification">notification</option>
                <option value="task">task</option>
                <option value="condition">condition</option>
            </select>
        </div>

        <div class="form-group">
            <label for="step-order">Order</label>
            <input type="number" id="step-order" v-model.number="form.order" min="1" required>
        </div>

        <div class="form-group">
            <label for="step-email">Asignee Email</label>
            <input type="email" id="step-email" v-model="form.assigneeEmail" />
        </div>

        <button class="btn" type="submit">Add Step</button>
    </form>
</template>

<script setup>

import { reactive } from "vue";

const emit = defineEmits(["created"]);

const form = reactive({
    name: "",
    stepType: "approval",
    order: 1,
    assigneeEmail: "",
});

const handleSubmit = () => {
    emit("created", {
        name: form.name,
        stepType: form.stepType,
        order: form.order,
        metadata: {
            assigneeEmail: form.assigneeEmail,
        },
    });

    form.name = "";
    form.stepType = "approval";
    form.order = 1;
    form.assigneeEmail = "";
};

</script>

<style scoped>

.form-card {
    background: #fff;
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
    border: 1px soild #ccc;
    border-radius: 6px;
}

.btn {
    background: #111827;
    color: white;
    border: none;
    padding: 10px 4px;
    border-radius: 6px;
    cursor: pointer;
}

</style>