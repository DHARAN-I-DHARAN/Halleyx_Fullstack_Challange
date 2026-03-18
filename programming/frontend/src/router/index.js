import { createRouter, createWebHistory } from "vue-router";
import WorkflowsView from "@/views/WorkflowsView.vue";
import WorkflowDetailsView from "@/views/WorkflowDetailsView.vue";
import ExecutionView from "@/views/ExecutionView.vue";
import DashboardView from "@/views/DashboardView.vue";

const routes = [
  { path: "/workflows", name: "workflows", component: WorkflowsView },
  { path: "/workflows/:id", name: "workflow-details", component: WorkflowDetailsView, props: true, },
  { path: "/executions", name: "executions", component: ExecutionView },
  { path: "/", name: "dashboard", component: DashboardView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
