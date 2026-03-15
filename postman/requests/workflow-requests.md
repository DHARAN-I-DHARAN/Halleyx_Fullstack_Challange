# Workflow Requests

## Create Workflow
POST http://localhost:5000/api/workflows

### Body
```json
{
  "name": "Expense Approval",
  "description": "Approval workflow for expenses",
  "version": 1,
  "isActive": true,
  "inputSchema": {
    "amount": { "type": "number", "required": true },
    "country": { "type": "string", "required": true }
  }
}


---

## 3. Create `postman/requests/step-requests.md`

Paste this:

```md
# Step Requests

## Create Step
POST http://localhost:5000/api/steps/workflow/:workflowId

### Body
```json
{
  "name": "Manager Approval",
  "stepType": "approval",
  "order": 1,
  "metadata": {
    "assigneeEmail": "manager@example.com"
  }
}