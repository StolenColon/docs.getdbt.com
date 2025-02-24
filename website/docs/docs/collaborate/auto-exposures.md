---
title: "Auto-exposures"
sidebar_label: "Auto-exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
pagination_prev: null
pagination_next:  "docs/collaborate/data-tile"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg
---

# Auto-exposures <Lifecycle status="enterprise" />

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. Auto-exposures integrate natively with Tableau (Power BI coming soon) and auto-generate downstream lineage in dbt Explorer for a richer experience.

Auto-exposures help users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products. It imports and auto-generates exposures based on Tableau dashboards, with user-defined curation.

## Supported plans
Auto-exposures is available on the [dbt Cloud Enterprise](https://www.getdbt.com/pricing/) plan. Currently, you can only connect to a single Tableau site on the same server.

:::info Tableau Server
If you're using Tableau Server, you need to [allowlist dbt Cloud's IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your dbt Cloud region.
:::

For more information on how to set up auto-exposures, prerequisites, and more &mdash; refer to [configure auto-exposures in Tableau and dbt Cloud](/docs/cloud-integrations/configure-auto-exposures).

## About Auto exposures and active exposures

| Feature | Auto-exposures | Active exposures |
| ---- | ---- | ---- |
| Location  | dbt Explorer | dbt Cloud scheduler |
| Purpose | Automatically brings downstream assets (like Tableau workbooks) into your dbt lineage. | Proactively refreshes the underlying data sources (like Tableau extracts) during scheduled dbt jobs. |
| Benefits | Provides visibility into data flow and dependencies. | Ensures BI tools always have up-to-date data without manual intervention. |
| Use case | Helps users understand how models are used and reduces incidents. | Optimizes timeliness and reduces costs by running models when needed. |

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>

## Considerations
import ConsiderationsTableau from '/snippets/_auto-exposures-considerations-tb.md';

<ConsiderationsTableau/>
