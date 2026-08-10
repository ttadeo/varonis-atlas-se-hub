---
title: AWS Bedrock
url: https://prod.alltrue-be.com/_docs/docs/log_sources/aws_bedrock
section: log_sources
---

# AWS Bedrock

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- AWS BedrockExport PDFOn this page# AWS Bedrock
This Log Source ingests **AWS Bedrock model-invocation logs** — prompts and responses — from your S3 bucket into Atlas for offline runtime-policy evaluation, alerting, and a unified investigation view. The data plane polls the invocation logs from your bucket via cross-account IAM; it is configured once per AWS account and region, and no credentials are stored in Atlas.

This page covers prompt and response **log ingestion**. For what Bedrock is and for usage statistics from cloud discovery, see [AWS Bedrock provider](/_docs/docs/providers/aws_bedrock).

The Bedrock account and region are AWS-specific because Atlas reads invocation logs from the AWS S3 destination. The Atlas Data Plane is selected separately in the integration wizard and can be an AWS or Azure Data Plane when registered for the customer (see [Log Sources](/_docs/docs/log_sources/overview)).

## Before you start[​](#before-you-start)
Two things must be in place before Bedrock prompts and responses are ingested:

- **Onboard the AWS account for Cloud Discovery, with Bedrock logging enabled.** This is the standard [AWS Cloud Account Discovery](/_docs/docs/providers/aws) onboarding, which includes an option to enable Bedrock logging in the onboarding template. With that option selected, onboarding turns on Bedrock model-invocation logging, creates the S3 bucket that receives the logs, and grants Atlas cross-account read access to that bucket. You do **not** need to enable model-invocation-logging by hand in the AWS console — Bedrock invocation and logging are both enabled as part of onboarding the AWS account.
- **Create this integration explicitly.** You must add the AWS Bedrock Log Source described below. Without it, Bedrock usage statistics from discovery are still available, but **no prompts or responses are ingested**.
- **Allow outbound network access from your data plane to Amazon S3.** The data plane reads the invocation-log bucket directly, so it needs network reachability to S3. This is separate from the cross-account permissions granted in step 1 — a correct IAM setup with a blocked network path still ingests nothing. The S3 endpoint is regional and follows the source bucket's own region, which is not necessarily the region your data plane runs in. See [Configuring Log Sources](/_docs/docs/log_sources/configuration) for why the data plane is the originating caller.

## How ingestion works[​](#how-ingestion-works)
When you create the integration, Atlas reads the model-invocation-logging configuration that onboarding set up for the chosen account and region and discovers the S3 bucket and prefix where Bedrock writes its logs. Bedrock writes **gzipped JSON-lines invocation logs** to that bucket. The data plane then periodically pulls new log objects using short-lived credentials and a last-modified watermark, copying them into its ingestion zone for evaluation.

## Add an AWS Bedrock log source[​](#add-an-aws-bedrock-log-source)
In **Admin Console &gt; System Settings &gt; Log Sources**, click **Add New Integration** and select the **AWS Bedrock** card. Pick the **AWS account** and **region** for the source. The region dropdown only offers regions where model-invocation-logging already reports an S3 destination; creating the integration in a region without logging enabled fails with an error.

The rest of the setup — the four-step wizard, assigning the integration to a project, and applying policies to the created resource — is the same for every Log Source. See [Configuring Log Sources](/_docs/docs/log_sources/configuration).

## Offline evaluation and where events appear[​](#offline-evaluation-and-where-events-appear)
AWS Bedrock activity is evaluated **offline**: policy actions configured to BLOCK or MODIFY are surfaced as **ALERT** (see [Configuring Log Sources](/_docs/docs/log_sources/configuration) for detail). Ingested events appear in [AI Investigation](/_docs/docs/applications/ai_monitor).

## Related[​](#related)

- [Configuring Log Sources](/_docs/docs/log_sources/configuration) — shared wizard, project scoping, and policy mechanics.
- [Log Sources](/_docs/docs/log_sources/overview) — the Log Sources overview and data-plane requirement.
- [AWS Bedrock provider](/_docs/docs/providers/aws_bedrock) — what Bedrock is, and discovery/usage statistics.
- [AWS Cloud Account Discovery](/_docs/docs/providers/aws) — the account-onboarding prerequisite; enables Bedrock logging and provisions the log bucket.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where ingested events appear.

## Troubleshooting[​](#troubleshooting)
SymptomWhat it meansWhat to doThe integration is configured and permissions look correct, but no Bedrock prompts or responses appear in Atlas.The data plane could not reach Amazon S3 to read the invocation-log bucket. Because the read position only advances after a successful read, it stays where it was and the same objects are retried on the next cycle.Confirm the data plane has outbound network access to S3 in the source bucket's region, and restore it if it is blocked. Then wait for the next scheduled poll. If access is confirmed open and activity still does not appear, contact Atlas support.
A permissions problem looks different: the read is refused immediately rather than timing out. If access to the bucket was never granted, revisit the cross-account setup in [Before you start](#before-you-start) rather than the network path.

For the shared explanation of why the data plane makes this call, see [Configuring Log Sources](/_docs/docs/log_sources/configuration).
[PreviousAnthropic OTEL Logs](/_docs/docs/log_sources/anthropic_otel)[NextSalesforce Agentforce](/_docs/docs/log_sources/salesforce_agentforce)- [Before you start](#before-you-start)- [How ingestion works](#how-ingestion-works)- [Add an AWS Bedrock log source](#add-an-aws-bedrock-log-source)- [Offline evaluation and where events appear](#offline-evaluation-and-where-events-appear)- [Related](#related)- [Troubleshooting](#troubleshooting)
