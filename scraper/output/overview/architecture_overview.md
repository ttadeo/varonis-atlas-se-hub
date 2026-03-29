---
title: Architecture Overview
url: https://prod.alltrue-be.com/_docs/docs/overview/architecture
section: overview
---

# Architecture Overview

- [](/_docs/)- Overview- Architecture OverviewOn this page# Architecture Overview
The system comprises two infrastructure components, called "planes". The control plane runs as a SaaS on the Varonis network, while the data plane runs within a VPC within your AWS account.

## Control plane and Data plane FAQ[​](#control-plane-and-data-plane-faq)
### Data plane related questions:[​](#data-plane-related-questions)

- 
Are AI Gateway and Observability part of data plane?
Yes, AI Gateway and Observability layer (Opensearch instance) both reside on the dataplane, which is deployed in the customer's own AWS environment (VPC).

- 
What customer data will the data plane collect and store within data plane?
If the AI Gateway is deployed, any LLM activity traversing it will be logged in the Observability layer (deployed in the customer data plane). This includes info such as LLM inputs/outputs, as well as Guardrail actions that have fired.

- 
Is data plane collecting any customers sensitive data?
Depends on configuration. If the AI Gateway has been deployed and there is sensitive data present in any of the inputs/outputs these may be logged in the observability layer. This is controlled through a number of configuration items that you set in AI Observability -&gt; Configuration. There is a setting per project. Select your project and scroll down to the Gateway/Firewall section. You can configure what gets logged and at what log level it is logged. Log events will reside within the data plane which is deployed inside the customer's organization for this very reason.

- 
What type of data is forwarded from the data plane to control plane?
Rules are processed by the rules orchestrator on the control plane which means it does receive LLM input/output data, but this data is never persisted. Over the coming months, the architecture will change so that all rules processing will take place on the customer Dataplane.

- 
What is the data retention threshold/limits on data plane? Is it based on no. of days, volume of data?
By default, the retention policy for the observability layer is 3 months in the index and 6 months in s3 files. Customer may request their specific retention policy to be modified to be more or less.

### Control plane related questions:[​](#control-plane-related-questions)

- 
What type of data is directly going to control plane?
The control plane handles most functions not related to the AI Gateway (proxy) and Observability layers. Control plane performs: AI Inventory scanning, SPM scanning including pentesting, GRC services including the compliance audits and TPRM functions, and handles any integrations with SIEMs like Splunk and Service Now. In the case of the AI Gateway usage, if there are Guardrail policies, LLM activity is sent to the control plane for evaluation by the rules orchestrator, but this data is not stored in any way. As previously mentioned, we are working on moving all rule processing functions to the dataplane.

- 
Is control plane responsible to configure and manage all components on data plane or there is a management layer in data plane as well?
All functions are managed from the control plane. There is no separate management interface for the Dataplane that is accessible.

- 
What is the data retention threshold/limits on control plane?
There is no customer-configured retention limit on the control plane.

[PreviousPlatform and Applications Overview](/_docs/docs/overview/platform_and_applications)[NextOrganizations and Projects Overview](/_docs/docs/overview/orgs_and_projects)- [Control plane and Data plane FAQ](#control-plane-and-data-plane-faq)[Data plane related questions:](#data-plane-related-questions)- [Control plane related questions:](#control-plane-related-questions)
