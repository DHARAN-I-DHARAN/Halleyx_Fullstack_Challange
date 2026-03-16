<template>
  <div class="page">
    <h1>Halleyx Workflow Engine</h1>
    <p>Frontend dashboard for workflows, rules, and executions.</p>

    <div class="card-grief">
      <div class="card">
        <h2>workflows</h2>
        <p>create and manage workflows</p>
        <router-link to="/workflows" class="btn">Go to Workflows</router-link>
      </div>

      <div class="card">
        <h2>Executions</h2>
        <p>Run workflows and inspect logs.</p>
        <router-link to="/executions" class="btn">Go to Executions</router-link>
      </div>
    </div>

  </div>
</template>

<script setup></script>

<style scoped>
.page{
  padding:24px;
}
 .card-grid{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top:24px;
 }

  .card{
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    background: #fff;
  } 
  
  .btn{
    display: inline-block;
    margin-top:12px;
    text-decoration: none;
    background: #222;
    color: #fff;
    padding: 10px 14px;
    border-radius:6px;
  }
  </style>