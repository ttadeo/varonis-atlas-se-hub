---
title: Architecture Overview
url: https://prod.alltrue-be.com/_docs/docs/overview/architecture
section: overview
---

# Architecture Overview

- [](/_docs/)- Overview- Architecture OverviewOn this page# Architecture Overview
The system comprises two infrastructure components, called "planes." The control plane runs as a SaaS on the Varonis network, while the data plane runs within a VPC in your AWS account.

## Control plane and Data plane FAQ[​](#control-plane-and-data-plane-faq)
### Data plane related questions:[​](#data-plane-related-questions)

- 
Are AI Runtime Protection and Observability part of the data plane?
Yes. AI Runtime Protection and the Observability layer (OpenSearch instance) both reside on the data plane, which is deployed in the customer's own AWS environment (VPC).

- 
What customer data does the data plane collect and store?
If AI Runtime Protection is deployed, any LLM activity traversing it is logged in the Observability layer (deployed in the customer data plane). This includes information such as LLM inputs/outputs, as well as guardrail actions that have fired.

- 
Does the data plane collect any customer sensitive data?
This depends on configuration. If AI Runtime Protection has been deployed and sensitive data is present in any of the inputs/outputs, it may be logged in the Observability layer. This is controlled through a number of configuration items that you set in AI Observability -&gt; Configuration. There is a setting per project. Select your project and scroll down to the Runtime/Firewall section. You can configure what gets logged and at what log level. Log events reside within the data plane, which is deployed inside the customer's organization for this very reason.

- 
What type of data is forwarded from the data plane to the control plane?
All rules processing takes place entirely on the customer data plane -- no unencrypted LLM input/output data leaves the customer's account. Rule settings are retrieved from the control plane, but all evaluation and processing happens on the data plane. Data sent to the control plane for analytics purposes is encrypted on the data plane before transmission, and customers retain full control over encryption keys, which they can rotate at any time. For more details on how encryption works, including Bring Your Own Key (BYOK) and key rotation, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

- 
What is the data retention threshold on the data plane? Is it based on number of days or volume of data?
By default, the retention policy for the Observability layer is 3 months in the index and 6 months in S3 files. Customers may request their specific retention policy to be adjusted.

### Control plane related questions:[​](#control-plane-related-questions)

- 
What type of data goes directly to the control plane?
The control plane handles most functions not related to the AI Runtime Protection (proxy) and Observability layers. The control plane performs AI Inventory scanning, SPM scanning including pentesting, GRC services including compliance audits and TPRM functions, and handles integrations with SIEMs like Splunk and ServiceNow. When AI Runtime Protection is in use, all guardrail policy evaluation happens on the data plane -- LLM activity is never sent unencrypted to the control plane. Analytics data is encrypted on the data plane before being sent to the control plane, and customers retain control over encryption keys at all times.

- 
Is the control plane responsible for configuring and managing all components on the data plane, or is there a separate management layer on the data plane?
All functions are managed from the control plane. There is no separate management interface for the data plane.

- 
What is the data retention threshold on the control plane?
There is no customer-configured retention limit on the control plane.

[PreviousPlatform and Applications Overview](/_docs/docs/overview/platform_and_applications)[NextOrganizations and Projects Overview](/_docs/docs/overview/orgs_and_projects)- [Control plane and Data plane FAQ](#control-plane-and-data-plane-faq)[Data plane related questions:](#data-plane-related-questions)- [Control plane related questions:](#control-plane-related-questions)
