---
title: Onboarding
url: https://prod.alltrue-be.com/_docs/docs/platform_services/onboarding
section: platform_services
---

# Onboarding

- [](/_docs/)- Platform Services- OnboardingOn this page# Onboarding
When you first log in, the system will automatically guide you through the Onboarding Wizard. This process involves several key steps to help you quickly set up and manage your system:

- Install Data Plane
- Link Cloud Accounts
- Create Organizations
- Define AI Projects
- Initiate AI Discovery
- Assign Discovered AI Resources

Each step in the Onboarding Wizard can be completed later within the application, or you can contact your account manager to reset the Onboarding Wizard at any time.

## Install the Data Plane[​](#install-the-data-plane)
The next step in the onboarding process is to install the Data Plane, which is necessary for enabling the TRiSM Hub's AI Observability and AI Runtime Protection features. You have two options for installation:

- Varonis Managed: If you prefer Varonis to manage the Data Plane, contact your account manager and click the "Skip this for now" button. Varonis will handle the installation and connect the Data Plane to your account automatically.
- Self-Managed: If you choose to install the Data Plane on your AWS account, you have two setup options, both of which rely on AWS CloudFormation:

Manually using the AWS Management Console.
- By running a command via terminal.

Follow the provided instructions based on your selected method. You will need to choose a region and input specific parameters such as an AWS Account ID, as shown in the instructions.

The installation process can take up to 30 minutes. You can either wait and click the "Test Connection" button once the installation is complete or proceed to the next step by selecting "Go to next step." If you wait and the installation succeeds, you will automatically move to the next step. If it fails, you will receive an error message.

If you choose to proceed without waiting and the installation fails, you will be notified in the application, and your account manager will contact you to assist with reattempting the installation. You can also reattempt the Data Plane setup later from the admin console.

At any time, you may click "Skip this for now" to continue with the onboarding process.

To learn more about the Data Plane, refer to the [Architecture Overview](/_docs/docs/overview/architecture).

## Link Cloud Accounts[​](#link-cloud-accounts)
The next step in the onboarding process prompts you to link your cloud accounts, which support your AI projects. The TRiSM Hub will run discovery on your connected accounts to identify AI resources used by your projects. The system supports discovery on multiple platforms, including AWS, Google Cloud Platform (GCP), Microsoft Azure, IBM WatsonX, and Databricks.

To link an AWS account, follow the instructions provided in the interface. You again have two options that leverage AWS CloudFormation:

- Manual Role Creation: Use the AWS Management Console to create the necessary role.
- Command Line Setup: Run the provided command in the AWS-CLI terminal.

After creating the roles and linking your AWS account, click "Test Connection" to verify the success and display a list of connected AWS accounts.

For other cloud providers, select your provider and input the required credentials. Refer to the documentation section on [Adding a new Cloud Account](/_docs/docs/applications/ai_inventory) for detailed steps on generating these credentials. You can link multiple accounts by clicking the add symbol (+) to connect more.

Once all accounts are added and credentials are provided, click "Link Accounts" to test the connections. Note that you must click the “Link Accounts” button in order to complete these connections, otherwise your configured accounts will not be saved. If the connections are successful, you will receive a success notification on the page. When you are finished, click "Finish Linking Accounts" to proceed to the next step in the wizard.

At any time, you may click "Skip this for now" to continue with the onboarding process.

## Create Organizations[​](#create-organizations)
In this step, you are prompted to create organizations within the platform. Creating organizations allows you to better manage access control, ensuring that the right teams have visibility and control over the appropriate AI systems. This is particularly useful when your company has multiple business units, teams, or external vendors managing different AI systems.

To get the most out of the TRiSM Hub's features, you should create organizations that reflect the structure of your AI systems. This will allow you to apply specific policies, perform targeted compliance audits, and gain detailed visibility into your AI resources.

You can create multiple organizations by clicking the add symbol (+) to add more. Note that you cannot have more organizations than linked cloud accounts.

For more detailed guidance on how organizations work, refer to the [Organizations and Projects Overview](/_docs/docs/overview/orgs_and_projects).

## Define AI Projects[​](#define-ai-projects)
In this step, you are prompted to define AI projects within the platform. Each AI project represents a specific AI system or application, allowing you to organize and manage your AI resources effectively. Defining projects helps you apply tailored policies, run compliance audits, and monitor specific AI systems separately from others.

By creating distinct projects for each AI system, you can customize runtime protection, access controls, and compliance settings based on the unique needs of each system. This also allows you to track and manage issues, technology inventories, and logs at the project level.

You can create multiple projects by clicking the add symbol (+) to add more. There is no limit on the number of projects that you can create.

For further details on how to structure projects, refer to the Organizations and Projects Overview section in the documentation.

## AI Discovery[​](#ai-discovery)
The next step in the Onboarding Wizard is the AI Discovery process. During this step, the system automatically scans your linked cloud accounts for AI resources. Any identified resources will be added to your inventory.

The discovery scan runs in the background and can take some time, depending on the number and size of your linked cloud accounts. You can check the progress of the scan by clicking the "Check scan status" button. Once the scan is complete, you will be redirected to the "Assign Discovered AI Resources" page, where you can assign the resources to your newly created projects.

If you prefer not to wait for the scan to finish, you can click the "I prefer not to wait - take me to the Application Home Screen" button. In this case, the discovered resources will be automatically assigned to the default project, and you can reassign them later within the application.

## Assign Discovered AI Resources[​](#assign-discovered-ai-resources)
In the final step of the Onboarding Wizard, you are prompted to assign the discovered AI resources to your newly created projects. For each organization, you will need to select the cloud account(s) to associate with the projects under that organization. Keep in mind that each cloud account can only be assigned to one organization.

If the organization has a single project, all resources discovered in the associated cloud accounts will be automatically assigned to that project. If the organization contains multiple projects, you can manually select which resources to assign to each project using the interface. To assist with making these resource assignments, you can filter the discovered resources by resource type by typing in the search bar and then selecting from the filtered results.

Once you've completed assigning resources, click the "Finish Onboarding" button to save your selections and proceed to the main page of the application.
[PreviousAI TPRM](/_docs/docs/applications/ai_tprm)[NextAdmin Console](/_docs/docs/platform_services/admin_console)- [Install the Data Plane](#install-the-data-plane)- [Link Cloud Accounts](#link-cloud-accounts)- [Create Organizations](#create-organizations)- [Define AI Projects](#define-ai-projects)- [AI Discovery](#ai-discovery)- [Assign Discovered AI Resources](#assign-discovered-ai-resources)
