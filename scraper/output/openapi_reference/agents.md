# Atlas API — agents

## GET /v1/control-plane/ai-agents/tools — Get Tools

**Endpoint**: `GET /v1/control-plane/ai-agents/tools`
**Summary**: Get Tools
**Tags**: agents

Get available tools for agent execution.

**Responses**:
- `200`: Successful Response

---

## GET /v1/control-plane/ai-agents/models — Get Models

**Endpoint**: `GET /v1/control-plane/ai-agents/models`
**Summary**: Get Models
**Tags**: agents

Get available models for agent execution.

**Parameters**:
- `action_name` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/frameworks — Get Frameworks

**Endpoint**: `GET /v1/control-plane/ai-agents/frameworks`
**Summary**: Get Frameworks
**Tags**: agents

**Responses**:
- `200`: Successful Response

---

## GET /v1/control-plane/ai-agents/active-agent-customer-frameworks — Get Active Agent Customer Frameworks

**Endpoint**: `GET /v1/control-plane/ai-agents/active-agent-customer-frameworks`
**Summary**: Get Active Agent Customer Frameworks
**Tags**: agents

Get all agent customer frameworks for the authenticated customer.

Args:
    framework_id: Optional framework_id to filter by

Returns:
    List of agent customer frameworks

**Parameters**:
- `framework_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/agent-customer-framework — Create Agent Customer Framework

**Endpoint**: `POST /v1/control-plane/ai-agents/agent-customer-framework`
**Summary**: Create Agent Customer Framework
**Tags**: agents

Create a new agent customer framework orm object.

Args:
    framework_create: The framework data to create
    session: The database session

Returns:
    The created agent customer framework

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/entity — Create Entity

**Endpoint**: `POST /v1/control-plane/ai-agents/entity`
**Summary**: Create Entity
**Tags**: agents

Create a new agent entity.

Args:
    entity: The entity data to create
    session: The database session

Returns:
    The created agent entity

Raises:
    HTTPException: If the control has no action instances

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/entities/{agent_control_id} — Get Entities

**Endpoint**: `GET /v1/control-plane/ai-agents/entities/{agent_control_id}`
**Summary**: Get Entities
**Tags**: agents

Get all agent entities for a control.

Args:
    agent_control_id: The ID of the control
    session: The database session

Returns:
    List of agent entities

**Parameters**:
- `agent_control_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/ai-agents/entity/{entity_id} — Update Entity

**Endpoint**: `PUT /v1/control-plane/ai-agents/entity/{entity_id}`
**Summary**: Update Entity
**Tags**: agents

Update an agent entity's variables.

This endpoint replaces the entire independent_variables dictionary with the new one.
The ready_to_execute status will be automatically updated based on whether all
required variables are present in the new dictionary.

Args:
    entity_id: The ID of the entity to update
    entity_update: The new independent variables to set
    session: The database session

Returns:
    The updated agent entity

Raises:
    HTTPException: If the entity is not found

**Parameters**:
- `entity_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/entity/{entity_id} — Get Entity With Variables

**Endpoint**: `GET /v1/control-plane/ai-agents/entity/{entity_id}`
**Summary**: Get Entity With Variables
**Tags**: agents

Get an agent entity by ID, including joined independent variable schema and values as 'independent_variable_setup'.

**Parameters**:
- `entity_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/ai-agents/entity/{entity_id} — Delete Entity

**Endpoint**: `DELETE /v1/control-plane/ai-agents/entity/{entity_id}`
**Summary**: Delete Entity
**Tags**: agents

Delete an agent entity.

**Parameters**:
- `entity_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-entity-execution — Create Control Entity Execution

**Endpoint**: `POST /v1/control-plane/ai-agents/control-entity-execution`
**Summary**: Create Control Entity Execution
**Tags**: agents

Trigger a control execution for a single entity.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/control-plane/ai-agents/control-entity-execution — Update Control Entity Execution

**Endpoint**: `PATCH /v1/control-plane/ai-agents/control-entity-execution`
**Summary**: Update Control Entity Execution
**Tags**: agents, internal

Update an agent control entity execution record.

This endpoint allows updating the status, log, output, updated_at timestamp,
and compliance status of an agent control entity execution.

Args:
    execution_update: The control entity execution update data
    session: The database session

Returns:
    The updated agent control entity execution

Raises:
    HTTPException: If the execution is not found

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/resume-control-entity-execution — Resume Control Entity Execution

**Endpoint**: `POST /v1/control-plane/ai-agents/resume-control-entity-execution`
**Summary**: Resume Control Entity Execution
**Tags**: agents

Trigger a control execution for a single entity.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-execution/resume — Resume Control Execution

**Endpoint**: `POST /v1/control-plane/ai-agents/control-execution/resume`
**Summary**: Resume Control Execution
**Tags**: agents

Resume a control execution via the internal agents service.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-execution — Create Control Execution

**Endpoint**: `POST /v1/control-plane/ai-agents/control-execution`
**Summary**: Create Control Execution
**Tags**: agents

Trigger control execution for all entities belonging to a control.

Returns:
    List of {"entity_id": ..., "control_execution_id": ...} for each executed entity.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/trigger-framework-controls — Trigger Framework Controls

**Endpoint**: `POST /v1/control-plane/ai-agents/trigger-framework-controls`
**Summary**: Trigger Framework Controls
**Tags**: agents

Trigger control execution for all controls in the framework

Returns:
    results = List of {"entity_id": ..., "control_execution_id": ...} for each executed entity.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/framework-control — Create Framework Control From Prototype

**Endpoint**: `POST /v1/control-plane/ai-agents/framework-control`
**Summary**: Create Framework Control From Prototype
**Tags**: agents

Create Agent Customer Framework Control from Prototype.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control — Create Framework Control

**Endpoint**: `POST /v1/control-plane/ai-agents/control`
**Summary**: Create Framework Control
**Tags**: agents

Create Agent Control ORM object associated with customer framework.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/control-plane/ai-agents/control — Patch Framework Control

**Endpoint**: `PATCH /v1/control-plane/ai-agents/control`
**Summary**: Patch Framework Control
**Tags**: agents

Update Agent Control ORM object associated with either new name or instructions

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/ai-agents/update-execution — Update Framework Execution

**Endpoint**: `PUT /v1/control-plane/ai-agents/update-execution`
**Summary**: Update Framework Execution
**Tags**: agents

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/ai-agents/control-group-execution — Update Control Group Execution

**Endpoint**: `PUT /v1/control-plane/ai-agents/control-group-execution`
**Summary**: Update Control Group Execution
**Tags**: agents

Creates new execution if execution type is changed, else updates execution name

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-group-execution — Create Control Group Execution

**Endpoint**: `POST /v1/control-plane/ai-agents/control-group-execution`
**Summary**: Create Control Group Execution
**Tags**: agents

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/action-execution/{action_execution_id} — Get Action Execution

**Endpoint**: `GET /v1/control-plane/ai-agents/action-execution/{action_execution_id}`
**Summary**: Get Action Execution
**Tags**: agents

Get an agent action execution by its ID.

**Parameters**:
- `action_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/control-entity-execution/{control_entity_execution_id} — Get Control Entity Execution

**Endpoint**: `GET /v1/control-plane/ai-agents/control-entity-execution/{control_entity_execution_id}`
**Summary**: Get Control Entity Execution
**Tags**: agents

Get an agent control entity execution by its ID.

**Parameters**:
- `control_entity_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/control/{control_id} — Get Control

**Endpoint**: `GET /v1/control-plane/ai-agents/control/{control_id}`
**Summary**: Get Control
**Tags**: agents

Get an agent control by ID.

Args:
    control_id: The ID of the control
    session: The database session

Returns:
    AgentControl with the control data

Raises:
    HTTPException: If the control is not found

**Parameters**:
- `control_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/ai-agents/control/{control_id} — Delete Control

**Endpoint**: `DELETE /v1/control-plane/ai-agents/control/{control_id}`
**Summary**: Delete Control
**Tags**: agents

Delete a control and all related agent actions and agent entities.

**Parameters**:
- `control_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/control-plane/ai-agents/agent-customer-framework/delete/{agent_customer_framework_id} — Delete Agent Customer Framework

**Endpoint**: `PATCH /v1/control-plane/ai-agents/agent-customer-framework/delete/{agent_customer_framework_id}`
**Summary**: Delete Agent Customer Framework
**Tags**: agents

Deactivate an agent customer framework by setting active=False.

This endpoint implements soft deletion by marking the framework as inactive
rather than physically removing it from the database.

Args:
    agent_customer_framework_id: The ID of the framework to deactivate
    customer_id: The customer ID from token
    session: The database session

Returns:
    The updated agent customer framework with active=False

Raises:
    HTTPException: If the framework is not found or access is denied

**Parameters**:
- `agent_customer_framework_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/ai-agents/agent-customer-framework/{framework_id} — Hard Delete Agent Customer Framework

**Endpoint**: `DELETE /v1/control-plane/ai-agents/agent-customer-framework/{framework_id}`
**Summary**: Hard Delete Agent Customer Framework
**Tags**: agents

Delete ORM Agent Customer Framework.

**Parameters**:
- `framework_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/action-execution-evidence/{action_execution_id} — Get Evidence Objects

**Endpoint**: `GET /v1/control-plane/ai-agents/action-execution-evidence/{action_execution_id}`
**Summary**: Get Evidence Objects
**Tags**: agents

**Parameters**:
- `action_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/evidence/{control_entity_execution_id} — Get Evidence Report

**Endpoint**: `GET /v1/control-plane/ai-agents/evidence/{control_entity_execution_id}`
**Summary**: Get Evidence Report
**Tags**: agents

Get the evidence ZIP for a specific control entity execution.

**Parameters**:
- `control_entity_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/reasoning/{control_entity_execution_id} — Get Evidence Reasoning

**Endpoint**: `GET /v1/control-plane/ai-agents/reasoning/{control_entity_execution_id}`
**Summary**: Get Evidence Reasoning
**Tags**: agents

Get the reasoning for a specific control entity execution.

**Parameters**:
- `control_entity_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/control-ready/{control_id} — Control Ready To Execute

**Endpoint**: `GET /v1/control-plane/ai-agents/control-ready/{control_id}`
**Summary**: Control Ready To Execute
**Tags**: agents

Checks if any control is ready to execute.

**Parameters**:
- `control_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/credential — Create Credential

**Endpoint**: `POST /v1/control-plane/ai-agents/credential`
**Summary**: Create Credential
**Tags**: agents

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/credential — Get Credential

**Endpoint**: `GET /v1/control-plane/ai-agents/credential`
**Summary**: Get Credential
**Tags**: agents

**Parameters**:
- `credential_name` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/control-plane/ai-agents/credential — Update Credential

**Endpoint**: `PATCH /v1/control-plane/ai-agents/credential`
**Summary**: Update Credential
**Tags**: agents

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/ai-agents/credential — Delete Credential

**Endpoint**: `DELETE /v1/control-plane/ai-agents/credential`
**Summary**: Delete Credential
**Tags**: agents

**Parameters**:
- `credential_ids` (query, required): List of credential IDs to delete
- `hard_delete` (query, optional): If true (default), perform a hard delete; otherwise perform a soft delete.

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/generate-action-input — Generate Filled Input For Action Prototypes

**Endpoint**: `POST /v1/control-plane/ai-agents/generate-action-input`
**Summary**: Generate Filled Input For Action Prototypes
**Tags**: agents

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/feedback/{action_execution_id} — Get Agent Action Execution Feedback

**Endpoint**: `GET /v1/control-plane/ai-agents/feedback/{action_execution_id}`
**Summary**: Get Agent Action Execution Feedback
**Tags**: agents

Get the summary for a specific action execution.

**Parameters**:
- `action_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-entity-with-execution — Create Control Entity With Execution

**Endpoint**: `POST /v1/control-plane/ai-agents/control-entity-with-execution`
**Summary**: Create Control Entity With Execution
**Tags**: agents

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/validate-create-entity-spreadsheet — Validate Create Entity Spreadsheet

**Endpoint**: `POST /v1/control-plane/ai-agents/validate-create-entity-spreadsheet`
**Summary**: Validate Create Entity Spreadsheet
**Tags**: agents

**Request Body** (required):
- `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/create-entities — Create Entities From Spreadsheet

**Endpoint**: `POST /v1/control-plane/ai-agents/create-entities`
**Summary**: Create Entities From Spreadsheet
**Tags**: agents

Create entities from a CSV spreadsheet after validating its content.

**Request Body** (required):
- `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/create-entities-csv/{agent_control_id} — Download Entities Csv Template

**Endpoint**: `GET /v1/control-plane/ai-agents/create-entities-csv/{agent_control_id}`
**Summary**: Download Entities Csv Template
**Tags**: agents

Download a CSV template for bulk entity creation for the given control.

**Parameters**:
- `agent_control_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/agent-customer-subagent-tool/{customer_subagent_id} — Get Agent Customer Subagent Tools By Id

**Endpoint**: `GET /v1/control-plane/ai-agents/agent-customer-subagent-tool/{customer_subagent_id}`
**Summary**: Get Agent Customer Subagent Tools By Id
**Tags**: agents

Get the tool tree for a specific customer subagent.

**Parameters**:
- `customer_subagent_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/agent-customer-subagent-tools — Get Agent Customer Tools

**Endpoint**: `GET /v1/control-plane/ai-agents/agent-customer-subagent-tools`
**Summary**: Get Agent Customer Tools
**Tags**: agents

Get the tool tree for a specific customer subagent.

**Responses**:
- `200`: Successful Response

---

## GET /v1/control-plane/ai-agents/longterm-memory — Get Longterm Memory

**Endpoint**: `GET /v1/control-plane/ai-agents/longterm-memory`
**Summary**: Get Longterm Memory
**Tags**: agents

List longterm memory files for the authenticated customer.

Returns a list of object keys (file paths) stored under the prefix
`agent-memory/{customer_id}/`.

Returns:
    A list of strings representing the object keys/paths

**Responses**:
- `200`: Successful Response

---

## POST /v1/control-plane/ai-agents/longterm-memory — Upload Longterm Memory

**Endpoint**: `POST /v1/control-plane/ai-agents/longterm-memory`
**Summary**: Upload Longterm Memory
**Tags**: agents

Upload longterm memory files from a zip archive.

Accepts a zip file containing folders and txt files, extracts them,
and uploads to file storage with prefix `agent-memory/{customer_id}/`.

Example file structure in zip:
- Control-AC1 AC4/domain-admin-review-saviant-process-follow-up.txt
- Control-AC1-AC4/identify-user-urm-review.txt

Returns:
    A dictionary with 'uploaded_count' indicating how many files were uploaded

**Request Body** (required):
- `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
