---
title: AI Inventory — How Atlas Discovers AI Models and Libraries
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_inventory
section: applications
---

# AI Inventory — How Atlas Discovers AI Models and Libraries

Atlas AI Inventory automatically discovers AI assets — models, libraries, LLM endpoints, notebooks, and more — through multiple discovery mechanisms. Understanding how discovery works is essential for positioning Atlas to customers who want to find out what AI is running in their environment.

## Discovery Sources

Atlas discovers AI resources through four channels:

### 1. Cloud Account Scanning

Connect a cloud account and Atlas scans it automatically to discover AI resources. Supported cloud providers:

- **AWS** — discovers models, SageMaker resources, S3-stored models, and more
- **Azure** — discovers Azure ML resources, Azure OpenAI deployments, subscriptions
- **Google Cloud** — discovers Vertex AI, GCP-hosted models
- **IBM WatsonX** — discovers WatsonX projects and models
- **Databricks** — discovers workspaces, models, notebooks

Once a cloud account is linked, the scan runs automatically and repeats nightly. New resources appear in the Default Project and must then be assigned to their correct projects using the Assign Cloud Resources tool. Removed resources and version updates are automatically reflected in inventory.

**AWS-specific:** You link the Atlas tenant with your AWS account by running an AWS CloudFormation stack that creates a read-only IAM role. Atlas uses this role to perform read-only API calls for discovery — no write access required.

**S3-stored AI models:** Atlas can scan S3 buckets and folders specifically to discover AI model artifacts. Once discovered, it can automatically trigger vulnerability scans against those models.

### 2. Code Repository Scanning

Connect GitHub, GitLab, BitBucket, or Azure DevOps repositories. Atlas scans the codebase to discover:

- **Dependency File Scanning** — detects AI-related libraries in `requirements.txt`, `Dockerfile`, `environment.yml`, `go.mod`
- **Hugging Face Model Scanning** — identifies Hugging Face models referenced in code
- **Jupyter Notebook Scanning** — finds notebooks, classifying them as new, rediscovered, or missing

Scans run automatically after linking and repeat nightly. Each code repository can only be connected to one project.

### 3. Dependency File Upload

Upload a dependency file directly (e.g., `requirements.txt`, `Dockerfile`, `go.mod`) without connecting a full code repository. Atlas scans the file and catalogs all AI-related libraries and dependencies found.

Note: This is a point-in-time scan — it captures the current state and does not update automatically. Re-upload the file to refresh.

### 4. Hosted Service Integration

Link external AI services that aren't in your cloud infrastructure or code. Currently supports OpenAI:

Connecting OpenAI lets Atlas inventory:
- Models (including fine-tuned models)
- Assistants
- Files and Vector Stores
- Fine-Tuning Jobs
- CustomGPTs

Once linked, Atlas scans the OpenAI account and surfaces all discovered resources in inventory automatically.

### 5. Manual Addition

Resources can be added manually for assets that automated scans don't catch. Manually-added resource types include:

- LLM Endpoints (required to be manual — not auto-discoverable)
- Models (from AWS S3, GCP Bucket, Azure Blob, or Hugging Face Hub)
- Libraries (by name and version)

## What Happens After Discovery

Once resources are discovered, they are:

1. Automatically categorized by type (LLM Endpoint, AI Software, AI Model, AI PaaS, etc.)
2. Assigned to the Default Project initially
3. Flagged as **Unreviewed** until a team member reviews and approves or rejects them
4. Checked for issues:
   - **Shadow AI** — unreviewed, unsanctioned, or improperly assigned resources
   - **Unprotected AI** — resources missing available protections (e.g., no AI Gateway attached to an LLM endpoint)

## SE Talking Points for Discovery

**The key customer question:** "Do you know what AI models and libraries are running in your AWS environment today?" Most customers answer no.

Cloud account scanning gives them the answer automatically — Atlas discovers models in S3, SageMaker, Databricks workspaces, and other cloud-native AI services without requiring manual cataloging.

For development teams, code scanning discovers AI libraries in every repository nightly, ensuring that new dependencies are caught as they're added — not weeks later during a manual audit.

For customers with existing OpenAI usage, the hosted service integration can surface every model, assistant, and fine-tuning job the organization has created — often revealing shadow AI assets the security team didn't know existed.
