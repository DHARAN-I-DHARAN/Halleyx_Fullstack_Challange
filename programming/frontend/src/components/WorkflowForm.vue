<template>
    <form class="form-card" @submit.prevent="handleSubmit">
        <h2>Create Workflow</h2>

        <div class="form-group">
            <label for="name">Name</label>
            <input  id="name" v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="form.description" rows="3"></textarea>
        </div>

        <div class="form-group">
            <label for="version">Version</label>
            <input  id="version" v-model.number="form.version" type="number" min="1" required />
        </div>

        <div class="form-group checkbox-group">
            <input  id="isActive" v-model="form.isActive" type="checkbox" />
            <label for="isActive">Active</label>
        </div>

        <button class="btn" type="submit">Create Workflow</button>
    </form>
</template>

<script setup>
import { reactive } from "vue";

const emit = defineEmits(["created"]);

const form = reactive({
    name: "",
    description:"",
    version: 1,
    isActive: true,
});

const handleSubmit = async () => {
    const payload = {
        name: form.name,
        description: form.description,
        version: form.version,
        isActive: form.isActive,
        inputSchema: {
            amount: { type: "number", required: true },
            country: { type: "String", required: true },
            priority: { type: "String", required: false},
        },
    };

    emit("created",payload);

    form.name = "";
    form.description = "";
    form.version = 1;
    form.isActive = true;
};
</script>

<style scoped>
.form-card {
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
.form-group textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.checkbox-group {
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.btn {
    background: #111827;
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
}

</style>