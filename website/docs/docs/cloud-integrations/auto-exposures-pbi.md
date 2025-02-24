---
title: "Auto exposures in Power BI"
sidebar_label: "Auto exposures in Power BI"
description: "Import and auto-generate exposures from Power BI dashboards. This helps you understand how models are used in downstream tools for a richer downstream lineage"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Auto exposures in Power BI <Lifecycle status="beta,enterprise" />

Auto exposures integrates natively with Power BI and [auto-generates downstream lineage](#view-auto-exposures) in [dbt Explorer](/docs/collaborate/explore-projects) for a richer experience.

## Prerequisites

To enable auto exposures, you should meet the following:

1. Your environment and jobs are on a supported dbt Cloud [release track](/docs/dbt-versions/cloud-release-tracks).
2. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
3. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
4. You have [admin permissions](/docs/cloud/manage-access/enterprise-permissions) in dbt Cloud to edit project settings or production environment settings.
5. Use Power BI Service as your BI tool and have reports published as part of workspaces.
6. Create enable metadata permissions or work with an admin to do so. 
7. Have access to Power BI Admin APIs to use auto exposures and see lineage between PowerBI and dbt Cloud

### Considerations
- Active exposures are designed for Power BI Service. Power BI Report Server isn't currently supported.
- Auto exposures currently support reports, with dashboard support planned for the future.
- Active exposures work with a variety of Power BI features, though M query language isn't currently supported.

## Set up auto exposures

Set up auto exposures in [Power BI](#set-up-in-power-bi) and [dbt Cloud](#set-up-in-dbt-cloud) to ensure that your Power BI extracts are updated regularly.

Once you've set this up in Power BI and [dbt Cloud](#set-up-in-dbt-cloud), you can view the [auto-exposures](#view-auto-exposures) in dbt Explorer.

### Set up in Power BI

This section of the document explains the set up steps for Power BI. 

1. Create a registered application and client secret in Azure AD. Follow the steps in the [Create a Microsoft Entra app documentation](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal?tabs=azure-portal#step-1---create-an-azure-ad-app).
2. When creating a new registration, fill in the following details and make sure you save these values:
    - Name: Name the registration whatever you’d like, for example, `dbt-cloud`
    - Supported account types: Accounts in the organizational directory only (Default directory, single tenant)
    - (Optional) Redirect URI: Leave blank or enter a URI if needed
3. Once you've created the registration, select the newly created registration, copy and save the following values:
    - Application (client) ID
    - Directory (tenant) ID
4. [Create a new client secret](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal?tabs=azure-portal#step-1---create-a-microsoft-entra-app) for the registration using the **Certificates & secrets** tab and copy the value. 
   - Note, you can specify the description and expiry of the client secret.
5. Copy and save the client secret value.
6. Now that you've created the registration app and client secret, you'll need to use the combination of the Application (client) ID, Directory (tenant) ID, and client secret to [set this up in dbt Cloud](#set-up-in-dbt-cloud).

### Set up Admin API access in Azure

Set up Admin access in Azure AD by creating a group to manage access to the registered application. 

:::info
To use auto exposures and view the lineage between Power BI and dbt Cloud, you must have access to Admin APIs in Power BI.
:::

1. Follow the steps in the [Create a basic group and add members documentation](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups#create-a-basic-group-and-add-members).
2. In Azure AD, navigate to **Groups** and select **New group**.
3. Create a group with the following details:
   - [**Group type**](https://learn.microsoft.com/en-us/entra/fundamentals/concept-learn-about-groups#group-types): Security
   - [**Group name**](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups#create-a-basic-group-and-add-members): Choose a name that you'll remember and that makes sense for the group. For example, `PowerBI API access`
4. Under **Members**, search and select the same app registration name created in the [previous step](#set-up-in-power-bi). For example, `dbt-cloud`.

### Set up Admin API access in Power BI

In this section, you'll set up the Admin API access in Power BI. To set up the Admin API access, you must be an admin in Power BI.

1. In Power BI, navigate to the **Tenant settings** section in the **Admin portal** page. Follow the steps in the [Set up Admin API access in Power BI documentation](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal?tabs=azure-portal#step-3---enable-the-power-bi-service-admin-settings).
2. Under **Developer settings**, enable the following:
   - Service principals can use Fabric APIs 
   - Enable Embed content in apps either for the entire organization or for the specific security group you created in Microsoft Entra ID. If not enabling for the entire organization, add the security group created in the [previous step](#set-up-admin-api-access-in-azure) (for example, `PowerBI API access`).
3. Under **Admin API settings**, enable the following settings for either for the entire organization or for the specific security group created. Press **Apply** to each of the tenant settings:
   - Service principals can access read-only admin APIs
   - Enhance admin APIs responses with detailed metadata
   - Enhance admin APIs responses with DAX and mashup expressions

### Configure workspace access in Power BI

In this section, you'll configure [workspace access](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-create-the-new-workspaces) in Power BI.

1. Sign into PowerBI and perform the following for each workspace you want to enable access to:
2. Navigate to **Workspaces** and use the three dots on the right of the workspace name to select **Workspace access** to configure access to the workspace.
3. Fill in the **Workspace access** form:
   - Click on **Add people or groups**.
   - Search and select the same app registration name created in the [Set up Power BI](#set-up-in-power-bi) step. For example, `dbt-cloud`.
   - Select **Contributor** permission before clicking **Add**.

:::info
The API endpoints used in this integration are read-only and _do not_ modify any Power BI resources. However, the [Fabric REST API](https://learn.microsoft.com/en-us/rest/api/fabric/report/items/get-report-definition?tabs=HTTP) does require `Report.ReadWrite.All` permission for the `Items - Get Report Definition` endpoint.
:::

### Set up in dbt Cloud <Lifecycle status="enterprise"/>

Now that you’ve set up PowerBI and necessary settings in Azure, you’re ready to enable this in dbt Cloud! 

1. In dbt Cloud, navigate to the project you want to add the auto-exposures to and then select **Settings**.
2. Under the **Exposures** section, select **Add integration** to add the Power BI connection.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Power BI connection."/>
3. Enter the details for the exposure connection you collected from Power BI in the [Set up in Power BI step](#set-up-in-power-bi) and click **Continue**. Note that all fields are case-sensitive.
   - Tenant ID: Directory (tenant) ID
   - Client ID: Application (client) ID
   - Client Secret: Client secret value
4. Select the workspaces you want to include for auto exposures and click **Save**.
5. dbt Cloud imports everything in the collection(s) and you can continue to [view them](#view-auto-exposures) in Explorer.

   :::info
   dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next sync (automatically once per day).
   
   dbt Cloud immediately starts a sync when you update the selected collections list, capturing new workbooks and removing irrelevant ones.
   :::

 ADD PBI SCREENSHOT

## View auto-exposures

After setting up auto-exposures in dbt Cloud, you can view them in [dbt Explorer](/docs/collaborate/explore-projects) for a richer experience.

import ViewExposures from '/snippets/_auto-exposures-view-pbi.md';

<ViewExposures/>

## Active exposures <Lifecycle status="beta"/>

With [active exposures](/docs/cloud-integrations/active-exposures), you can now use dbt [Cloud job scheduler](/docs/deploy/job-scheduler) to proactively refresh the underlying data sources (extracts) that power your Tableau Workbooks.

- Active exposures integrate with auto exposures and uses your `dbt build` job to ensure that Tableau extracts are updated regularly.
- You can control the frequency of these refreshes by configuring environment variables in your dbt environment.

To set up active exposures in dbt Cloud, refer to [Active exposures](/docs/cloud-integrations/active-exposures).
