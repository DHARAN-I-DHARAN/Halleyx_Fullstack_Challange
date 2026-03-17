<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="brand">Halleyx Challange</div>
      <div class="nav-links">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/workflows">Workflows</router-link>
        <router-link to="/executions">Executions</router-link>
      </div>
    </nav>

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #111827;
  color: white;
  padding: 16px 24px;
}

.brand {
  font-weight: bold;
  font-size: 18px;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a.router-link-exact-active {
  text-decoration: underline;
}

.main-content {
  min-height: calc(100vh - 64px);
  padding: 20px;
  background-color: rgba(68, 196, 228, 0.9);
  background-blend-mode: lighten;
}

.body {
text-align: center;
}
</style>
