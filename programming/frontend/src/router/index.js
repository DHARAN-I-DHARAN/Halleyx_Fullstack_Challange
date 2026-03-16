import { createRouter, createWebHistory } from "vue-router";
import WorkflowsView from "@/views/WorkflowsView.vue";
import WorkflowDetailsView from "@/views/WorkflowDetailsView.vue";
import ExecutionView from "@/views/ExecutionView.vue";
import DashboardView from "@/views/DashboardView.vue";

const routes = [
  { path: "/workflows", name: "workflows", component: WorkflowsView },
  { path: "/workflow/:id", name: "workflow-details", component: WorkflowDetailsView },
  { path: "/executions", name: "executions", component: ExecutionView },
  {cpath: "/", name: "dashboard", component: DashboardView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
