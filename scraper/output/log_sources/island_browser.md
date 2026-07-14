---
title: Island Browser
url: https://prod.alltrue-be.com/_docs/docs/log_sources/island_browser
section: log_sources
---

# Island Browser

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Island BrowserExport PDFOn this page# Island Browser
This Log Source ingests generative-AI activity captured by **Island Browser**. It is a **push** source: Atlas exposes a secure S3 destination on the integration, and the Island fleet writes generative-AI event files there. Atlas evaluates the activity offline and surfaces it in [AI Investigation](/_docs/docs/applications/ai_monitor).

This Log Source requires an **AWS data plane**; Azure data planes are not yet supported (see [Log Sources](/_docs/docs/log_sources/overview)).

## How Island Browser ingestion works[​](#how-island-browser-ingestion-works)
Island Browser uses a push model. Atlas provisions a destination for your tenant and exposes its details on the integration's **Destination** tab — a **Bucket Name**, a **Folder / Path**, and an **IAM Role** the Island fleet assumes to write there. The Island fleet writes generative-AI event files to that destination, and Atlas ingests them asynchronously. Ingestion status appears on the integration's **Jobs** tab.

There is one integration: the destination you configure on the Island side is the same destination Atlas surfaces on this integration's Destination tab.

## Create the Island Browser integration in Atlas[​](#create-the-island-browser-integration-in-atlas)
In **Admin Console &gt; System Settings &gt; Log Sources**, click **Add New Integration** and select the **Island** card. Give the integration a name, **Assign to Project**, and pick the **Data Plane** that will receive the events. The destination is assigned on creation — there are no API key, endpoint, or domain fields for Island.

For the general wizard, project scoping, and policy mechanics, see [Configuring Log Sources](/_docs/docs/log_sources/configuration).

## Read the destination details (Atlas)[​](#read-the-destination-details-atlas)
Open the integration and select the **Destination** tab. It shows the **Data Plane** (name, ID, region) and the **Ingestion Destination** values you point Island at:

- **Bucket Name**
- **Folder / Path**
- **IAM Role**

The **Format Requirements** note states that event files must be JSON, uncompressed or gzip-compressed.

## Configure the Island side[​](#configure-the-island-side)
In the Island management console, open **System Settings**, go to **System Storage**, and click **Setup** on the **AWS Connector**.

In the **AWS Integration Settings**:

- Set **Data flow** to **Copy to AWS**.
- Toggle **Generative AI Interactions** on.
- Under **Storage Configuration**, paste the values from the Atlas Destination tab — the Island fields are labeled **Cloud Storage Bucket**, **Cloud Storage Folder Prefix**, and **Cloud Storage Island Access Role ARN** (these are the same Bucket Name, Folder / Path, and IAM Role you read in Atlas).
- Set **Output Files Format** to **JsonLines**.
- Set **File Compression Algorithm** to **Gzip**.
- **Save** the integration.

Island exports newline-delimited JSON (JsonLines) compressed with gzip, which Atlas accepts as JSON / gzip.

## Verify ingestion[​](#verify-ingestion)
There is no Test Connection button. Confirm ingestion across three surfaces:

- Send some requests through Island and confirm they appear in the **AI Events** logs in Island.
- Confirm the **jobs** appear in the integration's **Jobs** drawer in the Atlas Admin Console.
- Confirm the events appear in **AI Investigation &gt; Events**.

If events are not arriving:

- Confirm Island is writing to the exact **Cloud Storage Bucket**, **Cloud Storage Folder Prefix**, and **Cloud Storage Island Access Role ARN** shown on the Atlas Destination tab.
- Confirm **Output Files Format** is JsonLines and **File Compression Algorithm** is Gzip.
- Confirm the assigned data plane is healthy and reachable.
[PreviousChatGPT Enterprise events from Varonis Data Security Platform](/_docs/docs/log_sources/chatgpt_enterprise_varonis_dspm)[NextAnthropic OTEL Logs](/_docs/docs/log_sources/anthropic_otel)- [How Island Browser ingestion works](#how-island-browser-ingestion-works)- [Create the Island Browser integration in Atlas](#create-the-island-browser-integration-in-atlas)- [Read the destination details (Atlas)](#read-the-destination-details-atlas)- [Configure the Island side](#configure-the-island-side)- [Verify ingestion](#verify-ingestion)
