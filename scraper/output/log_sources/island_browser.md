---
title: Island Browser
url: https://prod.alltrue-be.com/_docs/docs/log_sources/island_browser
section: log_sources
---

# Island Browser

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Island BrowserExport PDFOn this page# Island Browser
This Log Source ingests generative-AI activity captured by **Island Browser**. It is a **push-based integration**: Island writes event data to a destination that Atlas provisions for the selected Data Plane. Atlas evaluates the activity offline and surfaces it in [AI Investigation](/_docs/docs/applications/ai_monitor).

The setup differs by provider. Use the AWS procedure for an AWS Data Plane and the Azure procedure for an Azure Data Plane.

## Create the Island Browser integration in Atlas[​](#create-the-island-browser-integration-in-atlas)
In **Admin Console &gt; System Settings &gt; Log Sources**, click **Add New Integration** and select the **Island** card. Give the integration a name, use **Assign to Project**, and select the **Data Plane** that will receive the events.

Only a Data Plane with an Island destination provisioned for its cloud provider can be selected. An AWS Data Plane always has one. An **Azure** Data Plane has one only when it was deployed with Island log ingestion enabled — if it was not, it does not appear in the selector at all. See [Enabling Island on an existing data plane](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal#enabling-island-on-an-existing-data-plane) to enroll an Azure Data Plane that is already running.

Atlas allows one Island integration per Data Plane, on AWS and on Azure alike — creating a second integration against a Data Plane that already has one is rejected. The limit originates with Island's Azure connector, which does not send a path that Atlas could use to attribute records to separate integrations, but Atlas applies it to every provider because the ingestion resolver is provider-agnostic. To run several Island integrations, give each one its own Data Plane; every Data Plane carries its own destination, so the events stay separated by region and path.

For the general wizard, project scoping, and policy mechanics, see [Configuring Log Sources](/_docs/docs/log_sources/configuration).

## Integration with AWS[​](#integration-with-aws)
### Read the destination details in Atlas[​](#read-the-destination-details-in-atlas)
Open the integration and select the **Destination** tab. The **Ingestion Destination** shows:

- **Bucket Name**
- **Folder / Path**
- **IAM Role**

The **Format Requirements** note states that event files must be JSON, uncompressed or gzip-compressed.

### Configure the AWS Connector in Island[​](#configure-the-aws-connector-in-island)
In the Island management console, open **System Settings**, go to **System Storage**, and click **Setup** on the **AWS Connector**.

In the **AWS Integration Settings**:

- Set **Data flow** to **Copy to AWS**.
- Toggle **Generative AI Interactions** on.
- Under **Storage Configuration**, paste the values from the Atlas Destination tab. The Island fields are labeled **Cloud Storage Bucket**, **Cloud Storage Folder Prefix**, and **Cloud Storage Island Access Role ARN**.
- Set **Output Files Format** to **JsonLines**.
- Set **File Compression Algorithm** to **Gzip**.
- **Save** the integration.

Island exports newline-delimited JSON (JsonLines) compressed with gzip, which Atlas accepts as JSON / gzip.

## Integration with Azure[​](#integration-with-azure)
Island on an Azure Data Plane is opt-in. The Azure Data Plane deployment provisions the Island destinations only when **Enable Island browser log ingestion** is set to **Yes**; a Data Plane deployed without it has no Island resources and does not appear in the integration wizard's Data Plane list. See [the Island Log Ingestion tab](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal#island-log-ingestion-tab) for the deployment option, and [Enabling Island on an existing data plane](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal#enabling-island-on-an-existing-data-plane) for a Data Plane that is already running.

Azure Island uses two destinations:

- Blob storage for the conversation content.
- Event Hub for the accompanying audit records.

### Read the Azure destination details in Atlas[​](#read-the-azure-destination-details-in-atlas)
Open the integration and select the **Destination** tab. For an Azure Data Plane, Atlas shows these values:

- **Storage account name**
- **Storage Container**
- **Event Hub namespace**
- **Event Hub name**
- **Shared access policy name**

Atlas shows destination names and metadata only. It does not show the storage account key or the Event Hub credential. Retrieve those values from the Azure portal before configuring Island.

#### Retrieve the storage account key[​](#retrieve-the-storage-account-key)

- In the Azure portal, go to **Storage accounts**.
- Open the storage account whose name matches **Storage account name** in the Atlas Destination tab.
- Select **Security + networking &gt; Access keys**.
- Select **Show** on either access key, then copy its **Key** value. `key1` is used in the example below, but `key2` works as well. Use the storage account key in Island; do not use the storage account connection string.

#### Retrieve the Event Hub credential[​](#retrieve-the-event-hub-credential)

- In the Azure portal, go to **Event Hubs**.
- Open the namespace whose name matches **Event Hub namespace** in the Atlas Destination tab.
- Select **Settings &gt; Shared access policies**.
- Open the policy whose name matches **Shared access policy name**. In the shown configuration this policy is **SendAudits**.
- Copy the **Primary key**. Island's **Event Hub** section takes a key in its **Access key** field, not a connection string.

### Configure the Azure connectors in Island[​](#configure-the-azure-connectors-in-island)
In the Island management console, open **System Settings** and go to **System Storage**. The **Azure Connector** card shows the Azure Blob destination and its **Settings** control.

Open **Settings** on the **Azure Connector** and configure both sections with the Atlas metadata and Azure credentials you collected above:

- Under **User Events**, set **Data flow** to **Direct Browser-Azure**, then enable both **User events** and **Generative AI Interactions** under **Data types**. The storage and Event Hub sections below apply to this data flow.
- Under **Default Storage Configuration**, enter the **Storage account name** and the **Storage Container**, then paste the storage account **Key** value from the Azure portal into **Storage account key**.
- Under **Event Hub**, enter the Atlas **Event Hub namespace** as **Namespace**, the **Event Hub name** as **Name**, and the **Shared access policy name** as **Access name**. Paste the **Primary key** of the `SendAudits` policy into **Access key**.
- **Save Changes** to store the Azure connector configuration.

## Verify ingestion[​](#verify-ingestion)
There is no Test Connection button. After sending AI activity (ChatGPT or Claude AI interactions, for example) through Island:

- Open the integration's **Jobs** tab in Atlas and confirm that ingestion jobs complete successfully.
- Open **AI Investigation &gt; Events** and confirm that the Island activity appears.
- For Azure, confirm that both the conversation content and the associated audit records are present. If records are incomplete, verify that both the blob and Event Hub destinations are configured.

If events are not arriving:

- Confirm that the selected Data Plane is healthy and that the Island destination values match Atlas exactly.
- For AWS, confirm **Cloud Storage Bucket**, **Cloud Storage Folder Prefix**, **Cloud Storage Island Access Role ARN**, **JsonLines**, and **Gzip**.
- For Azure, confirm the Storage account name, Storage Container, storage key, Event Hub namespace, Event Hub name, Shared access policy name, and shared access key.
- Confirm that only one Island integration is assigned to the Data Plane.
[PreviousChatGPT Enterprise events from Varonis Data Security Platform](/_docs/docs/log_sources/chatgpt_enterprise_varonis_dspm)[NextAnthropic OTEL Logs](/_docs/docs/log_sources/anthropic_otel)- [Create the Island Browser integration in Atlas](#create-the-island-browser-integration-in-atlas)- [Integration with AWS](#integration-with-aws)[Read the destination details in Atlas](#read-the-destination-details-in-atlas)- [Configure the AWS Connector in Island](#configure-the-aws-connector-in-island)- [Integration with Azure](#integration-with-azure)[Read the Azure destination details in Atlas](#read-the-azure-destination-details-in-atlas)- [Configure the Azure connectors in Island](#configure-the-azure-connectors-in-island)- [Verify ingestion](#verify-ingestion)
