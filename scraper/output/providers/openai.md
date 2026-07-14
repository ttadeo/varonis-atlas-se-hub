---
title: OpenAI
url: https://prod.alltrue-be.com/_docs/docs/providers/openai
section: providers
---

# OpenAI

- [](/_docs/)- [Providers](/_docs/docs/providers)- OpenAIExport PDFOn this page# OpenAI
Atlas integrates with OpenAI as a *hosted service*: you link your OpenAI organization to Atlas with an API key, and Atlas discovers and inventories the OpenAI resources that key can see. Optionally, an Admin API Key unlocks organization-level discovery of usage-based model classes. This page explains what Atlas inventories from OpenAI, how the two-key model works, how to link a hosted service, and how to re-run discovery. Runtime invocation of OpenAI (via AI Gateway or AI Red Team) is configured separately as an LLM endpoint and is covered briefly at the end.

## How Atlas inventories OpenAI[​](#how-atlas-inventories-openai)
OpenAI is integrated as a hosted service. From **AI Inventory &gt; Configuration &gt; Hosted Services**, you link your OpenAI account using a project API key — and, optionally, an Admin API Key — and Atlas runs discovery against OpenAI's APIs to inventory the resources you own. The discovered resources surface in AI Inventory like any other inventoried resources.

There is no cloud-account link for OpenAI; everything is gated by the API keys you provide.

## OpenAI resources Atlas inventories[​](#openai-resources-atlas-inventories)
With the **API Key**, Atlas inventories:

- **Models** — the models available to your project, including base models and any models you have fine-tuned.
- **Fine-tunes** — the fine-tune jobs your project has created and the resulting fine-tuned models.
- **Assistants** — Assistants you have configured, including their attached tools. Atlas surfaces three tool kinds when present: **function tools**, **code interpreter**, and **file search**.
- **Files** — Files uploaded to your project.
- **Vector stores** — Vector stores your project has created.

With the **Admin API Key**, Atlas additionally inventories usage-based model activity at the organization level:

- **Completions** (including chat and reasoning model usage)
- **Embeddings**
- **Images** (image generation)
- **Moderations**

Atlas observes which models your organization actually called over the lookback window and adds usage-derived model rows to inventory alongside the API-key-discovered resources.

## How OpenAI discovery works[​](#how-openai-discovery-works)
Atlas accepts two OpenAI credentials — a project-level **API Key** and an organization-level **Admin API Key**. At least one must be provided; the form rejects a submission with neither. The API Key unlocks project-scoped resource inventory; the Admin API Key unlocks usage-based discovery.

- **API Key** (project-level) — unlocks the project-scoped inventory: Models, Fine-tunes, Assistants, Files, and Vector stores. The key requires **Read Only** or **All** permissions on the OpenAI project.
- **Admin API Key** (organization-level) — unlocks usage-based model inventory: Completions, Embeddings, Images, and Moderations. The key requires Read permissions for organization projects and usage.

When you submit the form, Atlas validates each key against OpenAI before saving the hosted service. If validation fails for either key, the form returns a single toast — *"One or more of the provided API keys are invalid. Please check and try again."* — and the hosted service is not saved.

## Creating an OpenAI API key[​](#creating-an-openai-api-key)
Before linking, create the API key(s) Atlas will use for discovery in the OpenAI Platform.

Prerequisites:

- Access to your OpenAI account with sufficient permissions to generate API keys.
- An Atlas user role with Write permission on the **AI Inventory &gt; Configuration** page.

To create a read-only project API key in OpenAI:

- Log in to the OpenAI Platform and open **Settings**.
- Click **API keys**, then **Create new secret key**.
- Enter a meaningful name, for example `openai-discovery-projectXYZ`.
- Select the **Project** you want to discover.
- Set permissions to **Read only**.
- Click **Create secret key**.
- Copy the secret key to a safe location — it cannot be viewed again later. Do not proceed without copying it.
- Click **Done**.

If you also want usage-based discovery, create an **Admin API Key** the same way at the organization level. Providing the Admin key is optional.

## Linking an OpenAI hosted service[​](#linking-an-openai-hosted-service)
Linking a hosted service requires an Atlas user role with Write permission on the **AI Inventory &gt; Configuration** page.

To link a new OpenAI hosted service:

- Go to **AI Inventory &gt; Configuration &gt; Hosted Services**.
- Click **Link New Hosted Service**.
- Under **Choose AI Service Provider**, select the **OpenAI** tile.
- Fill in the form:

**Display Name** (required, 3–50 characters) — a label for this hosted service, for example *"OpenAI Connector"*.
- **API Key** — your OpenAI project API key. At least one of API Key or Admin API Key must be provided. Helper text: *"The API key requires Read Only or All permissions to discover resources. Organizations will be automatically discovered."*
- **Admin API Key** — your OpenAI Admin API key. At least one of API Key or Admin API Key must be provided. Helper text: *"The Admin API key is used to discover admin resources and usage data."*
- **Assign to a Project** (optional) — toggle on and pick a project to associate the discovered resources with.

- Click **Link Service**.

Atlas validates the keys, saves the hosted service, shows a success toast, and starts the first discovery scan automatically. You return to the Hosted Services table where the new service appears with its **Service Name**, **Service Type** (`OpenAI`), **# of AI Resources** (count fills in as discovery completes), and **Status**.

## Required OpenAI permissions[​](#required-openai-permissions)

- **API Key** — needs **Read Only** or **All** permissions on the OpenAI project. Atlas validates the key at link time by listing the project's models; an invalid or under-scoped key fails validation.
- **Admin API Key** — needs Read permissions for organization projects and organization usage. Atlas validates the key at link time by listing the organization's projects.

## Running and re-running discovery[​](#running-and-re-running-discovery)
Atlas runs an initial discovery scan automatically when the hosted service is linked.

To re-run discovery later, go to **AI Inventory &gt; Configuration &gt; Hosted Services**, find the row for your OpenAI service, and choose **Run Discovery** from the row actions. Users with discovery permissions can trigger a scan on demand; the scan polls for completion roughly every 10 seconds and updates the resource counts on the row as it finishes.

Usage-based discovery (the resources unlocked by the Admin API Key) covers a fixed **30-day** lookback window from the time discovery runs. This window is not configurable from the UI.

## Related runtime: manually added OpenAI LLM endpoints[​](#related-runtime-manually-added-openai-llm-endpoints)
If you want Atlas to route OpenAI traffic through AI Gateway or pentest an OpenAI endpoint from AI Red Team, configure an OpenAI **LLM endpoint** separately under **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint**. An OpenAI LLM endpoint takes an API key and an optional base URL — there is no role-assumption variant. The hosted-service link described above does not by itself wire OpenAI into runtime proxying.

For runtime workflows, see [AI Gateway](/_docs/docs/applications/ai_gateway) and [AI Red Team](/_docs/docs/applications/ai_red_team). For the surrounding AI Inventory experience, see [AI Inventory](/_docs/docs/applications/ai_inventory) and the [Hosted Services](/_docs/docs/applications/ai_inventory/hosted_services) index. For the sibling provider page that documents AWS Bedrock, see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).
[PreviousGemini](/_docs/docs/providers/gemini)[NextCustom LLM endpoints](/_docs/docs/providers/custom)- [How Atlas inventories OpenAI](#how-atlas-inventories-openai)- [OpenAI resources Atlas inventories](#openai-resources-atlas-inventories)- [How OpenAI discovery works](#how-openai-discovery-works)- [Creating an OpenAI API key](#creating-an-openai-api-key)- [Linking an OpenAI hosted service](#linking-an-openai-hosted-service)- [Required OpenAI permissions](#required-openai-permissions)- [Running and re-running discovery](#running-and-re-running-discovery)- [Related runtime: manually added OpenAI LLM endpoints](#related-runtime-manually-added-openai-llm-endpoints)
