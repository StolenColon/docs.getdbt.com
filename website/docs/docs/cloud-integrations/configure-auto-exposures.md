---
title: "Auto-exposures"
id: "configure-auto-exposures"
sidebar_label: "Configure auto-exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Configure auto-exposures <Lifecycle status="enterprise" />

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. [Auto-exposures](/docs/collaborate/auto-exposures) integrates natively with Tableau and [auto-generates downstream lineage](/docs/collaborate/auto-exposures#view-auto-exposures-in-dbt-explorer) in dbt Explorer for a richer experience.

Auto-exposures help data teams optimize their efficiency and ensure data quality by:

- Helping users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products.
- Importing and auto-generating exposures based on Tableau dashboards, with user-defined curation.
- Enabling active exposure to run models based on when exposures are updated or need to be updated, improving timeliness and reducing costs.

## About Auto exposures and active exposures

| Feature | Auto-exposures | Active exposures |
| ---- | ---- | ---- |
| Location  | dbt Explorer | dbt Cloud scheduler |
| Purpose | Automatically brings downstream assets (like Tableau workbooks) into your dbt lineage. | Proactively refreshes the underlying data sources (like Tableau extracts) during scheduled dbt jobs. |
| Benefits | Provides visibility into data flow and dependencies. | Ensures BI tools always have up-to-date data without manual intervention. |
| Use case | Helps users understand how models are used and reduces incidents. | Optimizes timeliness and reduces costs by running models when needed. |

## Prerequisites

To access the features, you should meet the following:

1. Your environment and jobs are on a supported [release track](/docs/dbt-versions/cloud-release-tracks) dbt.
2. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
3. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
4. You have [admin permissions](/docs/cloud/manage-access/enterprise-permissions) in dbt Cloud to edit project settings or production environment settings.
5. Use Tableau as your BI tool and enable metadata permissions or work with an admin to do so. Compatible with Tableau Cloud or Tableau Server with the Metadata API enabled. 
   - If you're using Tableau Server, you need to [allowlist dbt Cloud's IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your dbt Cloud region.
   - Currently, you can only connect to a single Tableau site on the same server. 

## Set up in Tableau

This section of the document explains the steps you need to set up the auto-exposures integration with Tableau. Once you've set this up in Tableau and dbt Cloud, you can view the [auto-exposures](/docs/collaborate/auto-exposures#view-auto-exposures-in-dbt-explorer) in dbt Explorer.

To set up [personal access tokens (PATs)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) needed for auto exposures, ask a site admin to configure it for the account.

1. Ensure you or a site admin enables PATs for the account in Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-enable-pat.jpg" title="Enable PATs for the account in Tableau"/>

2. Create a PAT that you can add to dbt Cloud to pull in Tableau metadata for auto exposures. Ensure the user creating the PAT has access to collections/folders, as the PAT only grants access matching the creator's existing privileges.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-create-pat.jpg" title="Create PATs for the account in Tableau"/>

3. Copy the **Secret** and the **Token name** and enter them in dbt Cloud. The secret is only displayed once, so store it in a safe location (like a password manager).
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-copy-token.jpg" title="Copy the secret and token name to enter them in dbt Cloud"/>

4. Copy the **Server URL** and **Sitename**. You can find these in the URL while logged into Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tablueau-serverurl.jpg" title="Locate the Server URL and Sitename in Tableau"/>

   For example, if the full URL is: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:
   - The **Server URL** is the first part of the URL, in this case: `10az.online.tableau.com`
   - The **Sitename** is right after the `site` in the URL, in this case: `dbtlabspartner` 

5. You should now be ready to set up auto-exposures in dbt Cloud after copying the following items, which you'll need during the dbt Cloud setup: ServerURL, Sitename, Token name, and Secret.

## Set up in dbt Cloud <Lifecycle status="enterprise"/>

1. In dbt Cloud, navigate to the project you want to add the auto-exposures to and then select **Settings**.
2. Under the **Exposures** section, select **Add integration** to add the Tableau connection.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Tableau connection."/>
3. Enter the details for the exposure connection you collected from Tableau in the [previous step](#set-up-in-tableau) and click **Continue**. Note that all fields are case-sensitive.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-integration-details.jpg" title="Enter the details for the exposure connection."/>
4. Select the collections you want to include for auto exposures. 
   
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-select-collections.jpg" title="Select the collections you want to include for auto exposures."/>

      :::info
      dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next sync (automatically once per day).
   
      dbt Cloud immediately starts a sync when you update the selected collections list, capturing new workbooks and removing irrelevant ones.
      :::

5. Click **Save**. 

dbt Cloud imports everything in the collection(s) and you can continue to view them in Explorer. For more information on how to view and use auto-exposures, refer to [View auto-exposures from dbt Explorer](/docs/collaborate/auto-exposures) page.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="100%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

## Considerations
import ConsiderationsTableau from '/snippets/_auto-exposures-considerations-tb.md';

<ConsiderationsTableau/>

## Refresh with active exposures

With active exposures, you can now use dbt to proactively refresh the underlying data sources (extracts) that power your Tableau Workbooks.

- Active exposures integrate with auto exposures and uses your dbt build to ensure that Tableau extracts are updated regularly.
- You can control the frequency of these refreshes by configuring environment variables in your dbt environment.

To set up active exposures:

1. Ensure you have [Auto exposures enabled for Tableau](#configure-auto-exposures) and the desired exposures are included in your lineage.
2. Set the environment level variable `DBT_ACTIVE_EXPOSURES` to `1` within the environment you want the refresh to happen.
3. Set `DBT_ACTIVE_EXPOSURES_BUILD_AFTER` to control the maximum refresh cadence (in minutes) you want between each exposure refresh. 
   - Set to 1440 minutes (24 hours) by default, meaning that even for auto exposures that depend on more frequently running models, active exposures will not refresh the Tableau extracts more often than this period. 
   - Job runs will display the status of `skipped` for the auto-exposure if enough time hasn't yet passed.
4. You will see the update each time a job runs in production 
   - This can be viewed in the logs of the dbt run
   - More details can also be viewed in the debug logs
