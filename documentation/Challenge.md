
# Halleyx Full Stack Engineer - Challenge I - 2026

## **Overview**

Create a system that lets users design workflows, define rules, execute processes, and track every step. The system should allow automation, notifications, approvals, and dynamic decision-making based on input data.

---

## **1. Core Concepts**

### **1.1 Workflow**

A **workflow** is a process composed of multiple steps executed in sequence or conditionally. Example: **Expense Approval**→ Manager Approval → Finance Notification → CEO Approval → Task Completion.

**Attributes:**

|Field|Type|Description|
|---|---|---|
|`id`|UUID|Unique identifier|
|`name`|string|Workflow name (e.g., "Expense Approval")|
|`version`|integer|Workflow version, increments on updates|
|`is_active`|boolean|Whether this version is currently in use|
|`input_schema`|JSON|Defines required/optional fields, types, allowed values|
|`start_step_id`|UUID|The first step to execute|
|`created_at` / `updated_at`|ISO 8601 timestamp|Timestamps|

**Example Input Schema:**

```json
{
  "amount": {"type": "number", "required": true},
  "country": {"type": "string", "required": true},
  "department": {"type": "string", "required": false},
  "priority": {"type": "string", "required": true, "allowed_values": ["High", "Medium", "Low"]}
}
```

---

### **1.2 Step**

A **step** is a single action in a workflow. Steps can be of three types:

1. **Task** – automated or manual action (e.g., updating database, generating report)
2. **Approval** – requires user approval (e.g., manager approves expense)
3. **Notification** – sends alerts/messages (email, Slack, UI message)

**Attributes:**

|Field|Type|Description|
|---|---|---|
|`id`|UUID|Unique identifier|
|`workflow_id`|UUID|Associated workflow|
|`name`|string|Step name|
|`step_type`|enum (`task`,`approval`,`notification`)|Step type|
|`order`|integer|Default sequence order (can be overridden by rules)|
|`metadata`|JSON|Additional info (assignee_email, notification_channel, template, instructions)|
|`created_at` / `updated_at`|ISO 8601 timestamp|Timestamps|

**Example Step:**

```json
{
  "id": "step-001",
  "workflow_id": "workflow-001",
  "name": "Manager Approval",
  "step_type": "approval",
  "order": 1,
  "metadata": {"assignee_email": "manager@example.com"}
}
```

---

### **1.3 Rule**

A **rule** defines which step should execute next based on input data. Rules are evaluated in **priority order** (lowest number = highest priority).

**Attributes:**

|Field|Type|Description|
|---|---|---|
|`id`|UUID|Unique identifier|
|`step_id`|UUID|Step this rule belongs to|
|`condition`|string|Logical expression (`amount > 100 && country == 'US'`)|
|`next_step_id`|UUID|Next step to execute; `null` ends workflow|
|`priority`|integer|Lower numbers evaluated first|
|`created_at` / `updated_at`|ISO 8601 timestamp|Timestamps|

**Supported Operators/Functions:**

- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logical: `&&` (AND), `||` (OR)
- String: `contains(field, "value")`, `startsWith(field, "prefix")`, `endsWith(field, "suffix")`

**Example Rules for Manager Approval Step:**

|Priority|Condition|Next Step|
|---|---|---|
|1|`amount > 100 && country == 'US' && priority == 'High'`|Finance Notification|
|2|`amount <= 100||
|3|`priority == 'Low' && country != 'US'`|Task Rejection|
|4|`DEFAULT`|Task Rejection|

> **Note:** `DEFAULT` is required to handle unmatched conditions.

---

### **1.4 Execution**

When a workflow runs, it generates an **execution**.

**Attributes:**

|Field|Type|Description|
|---|---|---|
|`id`|UUID|Execution ID|
|`workflow_id`|UUID|Associated workflow|
|`workflow_version`|integer|Version being executed|
|`status`|enum (`pending`, `in_progress`, `completed`, `failed`, `canceled`)|Execution status|
|`data`|JSON|Input values provided|
|`logs`|array|Step execution logs|
|`current_step_id`|UUID|Step currently executing|
|`retries`|integer|Count of retries for failed steps|
|`triggered_by`|UUID|User who started execution|
|`started_at` / `ended_at`|ISO 8601 timestamp|Timestamps|

**Step Log Example:**

```json
{
  "step_name": "Manager Approval",
  "step_type": "approval",
  "evaluated_rules": [
    {"rule": "amount > 100 && country == 'US' && priority == 'High'", "result": true},
    {"rule": "amount <= 100 || department == 'HR'", "result": false}
  ],
  "selected_next_step": "Finance Notification",
  "status": "completed",
  "approver_id": "user-001",
  "error_message": null,
  "started_at": "2026-02-18T10:00:00Z",
  "ended_at": "2026-02-18T10:00:03Z"
}
```

---

## **2. Backend / API Requirements**

### **Workflows**

|Method|Endpoint|Description|
|---|---|---|
|POST|`/workflows`|Create workflow|
|GET|`/workflows`|List workflows (pagination & search)|
|GET|`/workflows/:id`|Get workflow details including steps & rules|
|PUT|`/workflows/:id`|Update workflow (creates new version)|
|DELETE|`/workflows/:id`|Delete workflow|

### **Steps**

|Method|Endpoint|Description|
|---|---|---|
|POST|`/workflows/:workflow_id/steps`|Add step|
|GET|`/workflows/:workflow_id/steps`|List steps for workflow|
|PUT|`/steps/:id`|Update step|
|DELETE|`/steps/:id`|Delete step|

### **Rules**

|Method|Endpoint|Description|
|---|---|---|
|POST|`/steps/:step_id/rules`|Add rule|
|GET|`/steps/:step_id/rules`|List rules for step|
|PUT|`/rules/:id`|Update rule|
|DELETE|`/rules/:id`|Delete rule|

### **Workflow Execution**

|Method|Endpoint|Description|
|---|---|---|
|POST|`/workflows/:workflow_id/execute`|Start workflow execution|
|GET|`/executions/:id`|Get execution status & logs|
|POST|`/executions/:id/cancel`|Cancel execution|
|POST|`/executions/:id/retry`|Retry failed step|

> **Note:** Retry only re-executes the failed step, not the entire workflow.

---

## **3. Rule Engine Behavior**

- Evaluate rules dynamically at runtime.
- First matching rule by priority is selected.
- Invalid rules mark step **failed**; workflow continues to `DEFAULT` or terminates if no rule matches.
- All rule evaluations, errors, and decisions are logged.
- _Additional Bonus: Support branching and looping (with **configurable max iterations** to prevent infinite loops)._

---

## **4. UI Requirements**

### **4.1 Workflow List**

_Shows all workflows with key details. Users can create new workflows, edit existing ones, or execute them._

- List workflows with columns: ID, Name, Steps, Version, Status, Actions.
- Features: search, filter, pagination.
- Action buttons: **Create**, **Edit**, **Execute**.

|ID|Name|Steps|Version|Status|Actions|
|---|---|---|---|---|---|
|uuid1|Expense Approval|4|3|Active|[Edit] [Execute]|
|uuid2|Employee Onboarding|2|1|Active|[Edit] [Execute]|

---

### **4.2 Workflow Editor**

_Allows users to define workflow name, input schema, and steps._

- Edit workflow name, description, input schema.
- Manage steps with Add/Edit/Delete options.
- Input schema editor supports type, required, allowed_values.

**Example Workflow Editor:**

```
Workflow: Expense Approval (Version 3)

Input Schema:
- amount: number (required)
- country: string (required)
- department: string (optional)
- priority: string (High|Medium|Low)

Steps:
1. Manager Approval (approval)  [Edit] [Delete]
2. Finance Notification (notification)  [Edit] [Delete]
3. CEO Approval (approval)  [Edit] [Delete]
4. Task Rejection (task)  [Edit] [Delete]

[Add New Step]
```

---

### **4.3 Step Rule Editor**

_Allows users to define rules that decide the next step based on input data._

- List rules with priority, condition, next step.
- Add/Edit/Delete rules with syntax validation.
- Drag-and-drop to reorder priorities.

**Example:**

```
Step: Manager Approval

Rules:
Priority | Condition                                     | Next Step
1        | amount > 100 && country == 'US' && priority == 'High' | Finance Notification
2        | amount <= 100 || department == 'HR'                  | CEO Approval
3        | priority == 'Low' && country != 'US'                 | Task Rejection
4        | DEFAULT                                              | Task Rejection

```

---

### **4.4 Workflow Execution**

_Allows users to run a workflow with input data and track its progress._

1. **Enter Input Data**

```
Workflow: Expense Approval
- amount: 250
- country: US
- department: Finance
- priority: High

[Start Execution]

```

1. **Execution Progress / Step Actions**

- Show current step, status, required actions.

1. **Execution Logs**

- Show evaluated rules, selected next step, status, approver/metadata, duration.

```
[Step 1] Manager Approval
Rules evaluated: [{"rule":"amount > 100 && country == 'US' && priority == 'High'", "result": true}, ...]
Next Step: Finance Notification
Status: Completed
Approver: user123
Duration: 00:00:03
```

---

### **4.5 Audit Log**

_Shows a summary of workflow executions for tracking and compliance:_

|Execution ID|Workflow|Version|Status|Started By|Start Time|End Time|Actions|
|---|---|---|---|---|---|---|---|
|uuid1234|Expense Approval|3|FAILED|user123|2026-02-18T10:15:23Z|2026-02-18T10:20:00Z|View Logs|
|uuid5678|Employee Onboarding|1|COMPLETED|user456|2026-02-18T11:00:00Z|2026-02-18T11:05:00Z|View Logs|

---

<aside> 💡

### **Submission Instructions**

</aside>

- **Code**: backend APIs, database models, frontend/UI
- **README**: setup instructions, dependencies, workflow engine design
- **Sample Workflows**: include 1–2 with steps and rules
- **Execution Example**: sample input & execution logs
- **Demo Video**: 3–5 minutes showing creation, rules, execution, logs
- **Packaging**: Git repo(please share the link), runnable as per README

---

<aside> 💡

### **Evaluation Matrix**

</aside>

|Criteria|Description|Weight|
|---|---|---|
|Backend / APIs|Workflow, steps, rules CRUD and execution APIs|20%|
|Rule Engine|Dynamic rules, branching, loops, error handling|20%|
|Workflow Execution|Step execution, approvals, notifications, logging|20%|
|Frontend / UI|Workflow editor, step/rule editor, execution view|15%|
|Demo Video|Shows workflow creation, rules, execution, logs|10%|
|Code Quality|Readable, modular, maintainable code|5%|
|Documentation|README, setup instructions, sample workflows|5%|
|Bonus|Extra features, advanced UI, automated tests|5%|
