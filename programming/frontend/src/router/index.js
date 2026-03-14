import { createRouter, createWebHistory } from "vue-router";
import WorkflowListView from "@/views/WorkflowListView.vue";
import WorkflowEditorView from "@/views/WorkflowEditorView.vue";
import ExecutionView from "@/views/ExecutionView.vue";
import AuditLogView from "@/views/AuditLogView.vue";

const routes = [
  { path: "/", name: "workflows", component: WorkflowListView },
  { path: "/workflow/new", name: "workflow-create", component: WorkflowEditorView },
  { path: "/executions", name: "executions", component: ExecutionView },
  {cpath: "/audit-logs", name: "audit-logs", component: AuditLogView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
