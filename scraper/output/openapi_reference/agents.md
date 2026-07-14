# agents API Endpoints

## GET /v1/control-plane/ai-agents/tools — List available tools for agent execution

**Endpoint**: `GET /v1/control-plane/ai-agents/tools`
**Summary**: List available tools for agent execution
**Tags**: agents

Return the full catalogue of tools that AI agents can invoke during control execution. Use this to discover what capabilities are available before building or configuring an agent control. The list is platform-wide; scoped to the token's customer for access.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/control-plane/ai-agents/models — List available LLM models for agent execution

**Endpoint**: `GET /v1/control-plane/ai-agents/models`
**Summary**: List available LLM models for agent execution
**Tags**: agents

Return all LLM models available for agent execution, optionally filtered by action name. When an action_name query parameter is provided a default model may be suggested. Use this to populate model-selection UI or to discover the default model before scheduling a control run. Scoped to the token's customer.

**Parameters**:
- `action_name` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/frameworks — List all agent frameworks

**Endpoint**: `GET /v1/control-plane/ai-agents/frameworks`
**Summary**: List all agent frameworks
**Tags**: agents

Return all agent frameworks defined on the platform. Frameworks are reusable blueprints that group related controls and define the overall structure of an AI security assessment workflow. Use this to discover available frameworks before activating one for a customer. Scoped to the token's customer for access.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/control-plane/ai-agents/active-agent-customer-frameworks — List active agent frameworks for this customer

**Endpoint**: `GET /v1/control-plane/ai-agents/active-agent-customer-frameworks`
**Summary**: List active agent frameworks for this customer
**Tags**: agents

Return all active (non-deactivated) framework instances that have been configured for the token's customer. Optionally filter by framework_id to narrow results to a specific framework type. Use this to discover which frameworks are currently operational and to retrieve their execution schedule and configuration. Scoped to the token's customer.

**Parameters**:
- `framework_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/agent-customer-framework — Activate an agent framework for this customer

**Endpoint**: `POST /v1/control-plane/ai-agents/agent-customer-framework`
**Summary**: Activate an agent framework for this customer
**Tags**: agents

Create a new customer-specific instance of an agent framework, activating it for the token's customer with the supplied execution schedule and description. The framework_id must reference an existing platform framework. Use this to onboard a customer onto a new AI security assessment workflow. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/entity — Create a new agent entity for a control

**Endpoint**: `POST /v1/control-plane/ai-agents/entity`
**Summary**: Create a new agent entity for a control
**Tags**: agents

Create a new entity (a subject or target instance) associated with a given agent control. Entities represent the specific resources or subjects the control will operate on, parameterized via independent variables and optional credentials. Use this to register a new target before triggering a control execution. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/entities/{agent_control_id} — List entities belonging to an agent control

**Endpoint**: `GET /v1/control-plane/ai-agents/entities/{agent_control_id}`
**Summary**: List entities belonging to an agent control
**Tags**: agents

Return all entities registered under the specified agent control. Each entity represents a distinct target or subject instance that the control will assess. Use this to review which subjects are configured for execution before triggering a control run. Scoped to the token's customer.

**Parameters**:
- `agent_control_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or agent control not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/ai-agents/entity/{entity_id} — Update an agent entity's variables and credentials

**Endpoint**: `PUT /v1/control-plane/ai-agents/entity/{entity_id}`
**Summary**: Update an agent entity's variables and credentials
**Tags**: agents

Replace the independent variables and credentials for an existing agent entity. The entire independent_variables dictionary is overwritten; the entity's ready_to_execute status is recalculated automatically based on whether all required variables are now present. Use this to reconfigure a target before the next control execution. Scoped to the token's customer.

**Parameters**:
- `entity_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/entity/{entity_id} — Get an agent entity with its variable schema and values

**Endpoint**: `GET /v1/control-plane/ai-agents/entity/{entity_id}`
**Summary**: Get an agent entity with its variable schema and values
**Tags**: agents

Return a single agent entity by ID, including the full independent variable schema and current values joined as independent_variable_setup. Use this to inspect what variables are required and which have been filled in before triggering execution. Scoped to the token's customer.

**Parameters**:
- `entity_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/ai-agents/entity/{entity_id} — Permanently delete an agent entity

**Endpoint**: `DELETE /v1/control-plane/ai-agents/entity/{entity_id}`
**Summary**: Permanently delete an agent entity
**Tags**: agents

Permanently delete an agent entity by ID. This removes the entity and any associated configuration from the control. This is a destructive, irreversible operation. Scoped to the token's customer.

**Parameters**:
- `entity_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-entity-execution — Trigger a control execution for a single entity

**Endpoint**: `POST /v1/control-plane/ai-agents/control-entity-execution`
**Summary**: Trigger a control execution for a single entity
**Tags**: agents

Initiate a control execution run for one specific entity within an optional control group execution. The agent will assess the entity according to the control's action list. Returns the execution ID to use for polling status. Use this to run a targeted assessment on a single subject. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
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

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/resume-control-entity-execution — Resume a paused control entity execution

**Endpoint**: `POST /v1/control-plane/ai-agents/resume-control-entity-execution`
**Summary**: Resume a paused control entity execution
**Tags**: agents

Resume a previously paused or interrupted control entity execution, continuing the agent's assessment from where it left off. Provide the entity ID and the existing control entity execution ID to resume. Returns the updated execution ID for status polling. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-execution/resume — Resume a control execution via the agents service

**Endpoint**: `POST /v1/control-plane/ai-agents/control-execution/resume`
**Summary**: Resume a control execution via the agents service
**Tags**: agents

Forward a resume request to the internal agents microservice to continue a stalled or awaiting-confirmation control execution. This endpoint bridges the control plane and the agents execution layer for human-in-the-loop resume flows. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-execution — Trigger execution for all entities in a control

**Endpoint**: `POST /v1/control-plane/ai-agents/control-execution`
**Summary**: Trigger execution for all entities in a control
**Tags**: agents

Initiate a control execution run for every entity belonging to the specified control, optionally grouped under a control group execution. Each entity is assessed independently by the agent. Returns a list of entity-to-execution-id mappings for tracking individual results. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/trigger-framework-controls — Trigger execution for all controls in a framework

**Endpoint**: `POST /v1/control-plane/ai-agents/trigger-framework-controls`
**Summary**: Trigger execution for all controls in a framework
**Tags**: agents

Initiate execution of every control within the specified customer framework, running all entities for each control under a shared control group execution. Returns a list of entity-to-execution-id mappings across all controls. Use this to kick off a full framework assessment run. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/framework-control — Create a framework control from a prototype

**Endpoint**: `POST /v1/control-plane/ai-agents/framework-control`
**Summary**: Create a framework control from a prototype
**Tags**: agents

Instantiate a new agent control within a customer framework by cloning and customizing a platform-defined prototype. The prototype provides the default action list and structure; the request can override name, instructions, and edges. Use this to add a preconfigured control to an existing customer framework. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control — Create an agent control for a customer framework

**Endpoint**: `POST /v1/control-plane/ai-agents/control`
**Summary**: Create an agent control for a customer framework
**Tags**: agents

Create a new agent control associated with a customer framework. The control defines the ordered action list, instructions, and edge relationships that the agent will follow during execution. Use this when building a custom control from scratch rather than from a prototype. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/control-plane/ai-agents/control — Update an agent control's name, instructions, or actions

**Endpoint**: `PATCH /v1/control-plane/ai-agents/control`
**Summary**: Update an agent control's name, instructions, or actions
**Tags**: agents

Partially update an existing agent control by providing a new name, instructions, action list, or edge definitions. Only the fields included in the request body are changed. Use this to refine an existing control's behavior without recreating it. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/ai-agents/update-execution — Update a customer framework's execution schedule

**Endpoint**: `PUT /v1/control-plane/ai-agents/update-execution`
**Summary**: Update a customer framework's execution schedule
**Tags**: agents

Update the execution type and frequency for an existing customer framework instance, controlling when the framework's controls are automatically triggered. Use this to change a framework from manual to scheduled execution or to adjust the recurrence cadence. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/ai-agents/control-group-execution — Update or replace a control group execution

**Endpoint**: `PUT /v1/control-plane/ai-agents/control-group-execution`
**Summary**: Update or replace a control group execution
**Tags**: agents

Update an existing control group execution's name, type, or scheduled time. If the execution type is changed a new group execution record is created to preserve history; otherwise the existing record is updated in place. Use this to correct scheduling metadata before or during a batch run. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-group-execution — Create a control group execution record

**Endpoint**: `POST /v1/control-plane/ai-agents/control-group-execution`
**Summary**: Create a control group execution record
**Tags**: agents

Create a new control group execution to group individual control entity executions under a single named run. The group execution tracks overall progress and scheduling context for a batch of control runs within a customer framework. Use this before triggering individual controls to obtain a group execution ID. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/action-execution/{action_execution_id} — Get an agent action execution by ID

**Endpoint**: `GET /v1/control-plane/ai-agents/action-execution/{action_execution_id}`
**Summary**: Get an agent action execution by ID
**Tags**: agents

Return the full details of a single agent action execution, including its status, log output, error message if any, and output payload. Use this to poll the result of a specific action step within a control run. Scoped to the token's customer.

**Parameters**:
- `action_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or action execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/control-entity-execution/{control_entity_execution_id} — Get a control entity execution by ID

**Endpoint**: `GET /v1/control-plane/ai-agents/control-entity-execution/{control_entity_execution_id}`
**Summary**: Get a control entity execution by ID
**Tags**: agents

Return the full details of a single control entity execution, including its status, compliance result, log, output, and action execution history. Use this to poll progress or retrieve the final result for a specific entity within a control run. Scoped to the token's customer.

**Parameters**:
- `control_entity_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or control entity execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/control/{control_id} — Get an agent control by ID

**Endpoint**: `GET /v1/control-plane/ai-agents/control/{control_id}`
**Summary**: Get an agent control by ID
**Tags**: agents

Return the full definition of an agent control, including its name, instructions, ordered action list, and edge relationships. Use this to inspect a control's configuration before triggering execution or when verifying recent changes. Scoped to the token's customer.

**Parameters**:
- `control_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Control not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/ai-agents/control/{control_id} — Permanently delete an agent control and its entities

**Endpoint**: `DELETE /v1/control-plane/ai-agents/control/{control_id}`
**Summary**: Permanently delete an agent control and its entities
**Tags**: agents

Permanently delete an agent control along with all related agent actions and agent entities. This is a destructive, irreversible operation. Ensure no active executions depend on this control before deleting. Scoped to the token's customer.

**Parameters**:
- `control_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Control not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/control-plane/ai-agents/agent-customer-framework/delete/{agent_customer_framework_id} — Deactivate a customer framework (soft delete)

**Endpoint**: `PATCH /v1/control-plane/ai-agents/agent-customer-framework/delete/{agent_customer_framework_id}`
**Summary**: Deactivate a customer framework (soft delete)
**Tags**: agents

Soft-delete a customer framework by marking it inactive (active=False). The framework record is preserved for audit history; it will no longer appear in active framework listings and will not be triggered for scheduled execution. Use this instead of hard delete when historical data must be retained. Scoped to the token's customer.

**Parameters**:
- `agent_customer_framework_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Framework not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/ai-agents/agent-customer-framework/{framework_id} — Permanently delete a customer framework

**Endpoint**: `DELETE /v1/control-plane/ai-agents/agent-customer-framework/{framework_id}`
**Summary**: Permanently delete a customer framework
**Tags**: agents

Permanently and irreversibly delete a customer framework record and all associated data. This is a hard delete — the framework cannot be recovered. Prefer the deactivate (soft-delete) endpoint unless you are certain the record and its history are no longer needed. Scoped to the token's customer.

**Parameters**:
- `framework_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Framework not found
- `500`: Unexpected server error
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

## GET /v1/control-plane/ai-agents/reasoning/{control_entity_execution_id} — Get reasoning and feedback for a control entity execution

**Endpoint**: `GET /v1/control-plane/ai-agents/reasoning/{control_entity_execution_id}`
**Summary**: Get reasoning and feedback for a control entity execution
**Tags**: agents

Return the agent's reasoning summary and feedback for a completed control entity execution. This includes the chain-of-thought or evaluation rationale produced during the run. Use this to understand why the agent reached a particular compliance verdict. Scoped to the token's customer.

**Parameters**:
- `control_entity_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Control entity execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/control-ready/{control_id} — Check whether a control is ready to execute

**Endpoint**: `GET /v1/control-plane/ai-agents/control-ready/{control_id}`
**Summary**: Check whether a control is ready to execute
**Tags**: agents

Check if any entity under the specified control has all required independent variables filled in and is therefore ready for execution. Returns a boolean ready flag alongside the control ID. Use this before triggering a control run to verify at least one entity can be executed. Scoped to the token's customer.

**Parameters**:
- `control_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Control not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/credential — Create Credential

**Endpoint**: `POST /v1/control-plane/ai-agents/credential`
**Summary**: Create Credential
**Tags**: agents

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

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

## POST /v1/control-plane/ai-agents/generate-action-input — Generate prefilled input for an action prototype

**Endpoint**: `POST /v1/control-plane/ai-agents/generate-action-input`
**Summary**: Generate prefilled input for an action prototype
**Tags**: agents

Use an LLM to generate a prefilled input payload for a given action prototype based on a free-text task description and the action's input schema. Returns a suggested input that an agent or user can review and adjust before submitting. Use this to accelerate control configuration from natural language intent. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/feedback/{action_execution_id} — Get summary feedback for an action execution

**Endpoint**: `GET /v1/control-plane/ai-agents/feedback/{action_execution_id}`
**Summary**: Get summary feedback for an action execution
**Tags**: agents

Return the agent-generated summary and feedback for a specific action execution, including an assessment of the action's outcome and any recommendations. Use this to review the qualitative result produced by the agent for an individual action step. Scoped to the token's customer.

**Parameters**:
- `action_execution_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Action execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/control-entity-with-execution — Create an entity and immediately trigger its execution

**Endpoint**: `POST /v1/control-plane/ai-agents/control-entity-with-execution`
**Summary**: Create an entity and immediately trigger its execution
**Tags**: agents

Create a new agent entity associated with a control and simultaneously enqueue it for execution within an existing control group execution. This combines entity registration and execution triggering into a single call. Use this when adding a new target mid-run that should be assessed immediately. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/validate-create-entity-spreadsheet — Validate Create Entity Spreadsheet

**Endpoint**: `POST /v1/control-plane/ai-agents/validate-create-entity-spreadsheet`
**Summary**: Validate Create Entity Spreadsheet
**Tags**: agents

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/ai-agents/create-entities — Create Entities From Spreadsheet

**Endpoint**: `POST /v1/control-plane/ai-agents/create-entities`
**Summary**: Create Entities From Spreadsheet
**Tags**: agents

Create entities from a CSV spreadsheet after validating its content.

**Request Body**: Required
- Content-Type: `multipart/form-data`

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

## GET /v1/control-plane/ai-agents/agent-customer-subagent-tool/{customer_subagent_id} — Get the tool tree for a specific customer subagent

**Endpoint**: `GET /v1/control-plane/ai-agents/agent-customer-subagent-tool/{customer_subagent_id}`
**Summary**: Get the tool tree for a specific customer subagent
**Tags**: agents

Return the hierarchical tool tree for a specific customer subagent, showing all tools and nested sub-tools available to that subagent. Use this to inspect the capabilities of a particular customer-configured subagent before building or executing a control that uses it. Scoped to the token's customer.

**Parameters**:
- `customer_subagent_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer subagent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/ai-agents/agent-customer-subagent-tools — List tool trees for all customer subagents

**Endpoint**: `GET /v1/control-plane/ai-agents/agent-customer-subagent-tools`
**Summary**: List tool trees for all customer subagents
**Tags**: agents

Return the hierarchical tool trees for all subagents configured for the token's customer. Each tree shows the tools and nested sub-tools available to a given subagent. Use this to discover which subagents are available and what capabilities each one exposes. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/control-plane/ai-agents/longterm-memory — List longterm memory files for this customer

**Endpoint**: `GET /v1/control-plane/ai-agents/longterm-memory`
**Summary**: List longterm memory files for this customer
**Tags**: agents

Return a list of all longterm memory file paths stored for the token's customer under the agent-memory prefix. Each item is an object key representing a file path within the storage hierarchy. Use this to inspect what memory context files are available to the agent before execution. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

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

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
