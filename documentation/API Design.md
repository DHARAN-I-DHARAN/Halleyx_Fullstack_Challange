## Workflows  
POST /workflows  
GET /workflows  
GET /workflows/:id  
PUT /workflows/:id  
DELETE /workflows/:id  
  
## Steps  
POST /workflows/:workflow_id/steps  
GET /workflows/:workflow_id/steps  
PUT /steps/:id  
DELETE /steps/:id  
  
## Rules  
POST /steps/:step_id/rules  
GET /steps/:step_id/rules  
PUT /rules/:id  
DELETE /rules/:id  
  
## Executions  
POST /workflows/:workflow_id/execute  
GET /executions/:id  
POST /executions/:id/cancel  
POST /executions/:id/retry