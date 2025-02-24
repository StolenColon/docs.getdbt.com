---
title: "Auto exposures in Power BI"
sidebar_label: "Auto exposures in Power BI"
description: "Import and auto-generate exposures from Power BI dashboards. This helps you understand how models are used in downstream tools for a richer downstream lineage"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Auto exposures in Power BI <Lifecycle status="preview,enterprise" />

Auto exposures integrates natively with Power BI and [auto-generates downstream lineage](#view-auto-exposures) in [dbt Explorer](/docs/collaborate/explore-projects) for a richer experience.

## Prerequisites

To enable auto exposures, you should meet the following:

1. Your environment and jobs are on a supported [release track](/docs/dbt-versions/cloud-release-tracks) dbt.
2. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
3. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
4. You have [admin permissions](/docs/cloud/manage-access/enterprise-permissions) in dbt Cloud to edit project settings or production environment settings.
5. Use Power BI Service as your BI tool 
6. Create enable metadata permissions or work with an admin to do so. 
7. Have access to Admin APIs to use auto exposures and see lineage between PowerBI and dbt Cloud

## Set up auto exposures

Set up auto exposures in [Power BI](#set-up-in-power-bi) and [dbt Cloud](#set-up-in-dbt-cloud) to ensure that your Power BI extracts are updated regularly.

### Set up in Power BI

This section of the document explains the steps you need to set up the auto-exposures integration with Power BI. Once you've set this up in Power BI and [dbt Cloud](#set-up-in-dbt-cloud), you can view the [auto-exposures](#view-auto-exposures) in dbt Explorer.

1. To set up auto exposures in Power BI, you need to create a registered application and client secret in Azure AD. Follow the steps in the [Step 1 - Create a Microsoft Entra app documentation](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal?tabs=azure-portal#step-1---create-an-azure-ad-app).
2. When creating a new registration, fill in the following details and make sure you save these values:
    - Name: Name the registration whatever you’d like, for example, `dbt-cloud`
    - Supported account types: Accounts in the organizational directory only (Default directory, single tenant)
    - (Optional) Redirect URI: Leave blank or enter a URI if needed
3. Once you've created the registration, select the newly created registration and copy the following values:
    - Application (client) ID
    - Directory (tenant) ID
4. Create a new client secret for the registration using the **Certificates & secrets** tab and copy the value. 
   - Note, you can specify the description and expiry of the client secret.
5. 

### Set up in dbt Cloud <Lifecycle status="enterprise"/>

1. In dbt Cloud, navigate to the project you want to add the auto-exposures to and then select **Settings**.
2. Under the **Exposures** section, select **Add integration** to add the Power BI connection.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Tableau connection."/>
3. Enter the details for the exposure connection you collected from Power BI in the [previous step](#set-up-in-power-bi) and click **Continue**. Note that all fields are case-sensitive.
   - Tenant ID: Directory (tenant) ID
   - Client ID: Application (client) ID
   - Client Secret: Client secret value
4. Select the workspaces you want to include for auto exposures and click **Save**.

      :::info
      dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next sync (automatically once per day).
   
      dbt Cloud immediately starts a sync when you update the selected collections list, capturing new workbooks and removing irrelevant ones.
      :::

dbt Cloud imports everything in the collection(s) and you can continue to [view them](#view-auto-exposures) in Explorer. 

update screenshot w pbi

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

## View auto-exposures

After setting up auto-exposures in dbt Cloud, you can view them in [dbt Explorer](/docs/collaborate/explore-projects) for a richer experience.


import ViewExposures from '/snippets/_auto-exposures-view-pbi.md';

<ViewExposures/>

## Active exposures <Lifecycle status="beta"/>

With [active exposures](/docs/cloud-integrations/active-exposures), you can now use dbt [Cloud job scheduler](/docs/deploy/job-scheduler) to proactively refresh the underlying data sources (extracts) that power your Tableau Workbooks.

- Active exposures integrate with auto exposures and uses your `dbt build` job to ensure that Tableau extracts are updated regularly.
- You can control the frequency of these refreshes by configuring environment variables in your dbt environment.

To set up active exposures in dbt Cloud, refer to [Active exposures](/docs/cloud-integrations/active-exposures).
