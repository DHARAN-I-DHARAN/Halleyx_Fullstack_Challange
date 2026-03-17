<template>
  <div class="page">
    <h1>Halleyx Workflow Engine</h1>
    <p>Frontend dashboard for workflows, rules, and executions.</p>

    <div class="card-grid">
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
  text-align:center;
}

 .card-grid{
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top:24px;
  justify-content: center;
  align-items: center;
 }

  .card{
    background: #6ce889;
    min-height:200px;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin:20px;
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