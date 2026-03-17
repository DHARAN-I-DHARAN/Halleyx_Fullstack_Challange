## Core Data Models

### Workflow
Stores workflow definition, version, active status, input schema, and starting step.

### Step
Stores individual workflow steps such as task, approval, and notification.

### Rule
Stores conditional expressions and the next step transition.

### Execution
Stores workflow runtime state, input data, current step, and execution logs.

## Phase 2
- Created Workflow model
- Created Step model
- Created Rule model
- Created Execution model
- Embedded logs inside Execution model for simpler audit tracking

## Collections

### Workflow
- name
- description
- version
- isActive
- inputSchema
- startStep
### Step
- workflow
- name
- stepType
- order
- metadata
### Rule
- step
- condition
- priority
- nextStep
### Execution
- workflow
- status
- inputData
- currentStep
- logs