---
title: "Use cases and examples for the Admin API"
sidebar_label: "Uses and examples"
---

With the Admin API, you can administer your dbt Cloud account by accessing its endpoints. Use this API to replicate resources across projects, accounts, and environments, or standardize project creation.

You can use this API in a variety of ways to get answers to your business questions. Answer these questions with the API:


| Use case | Outcome | <div style={{width:'400px'}}>Example questions</div> |
| --- | --- | --- |
| [Manage Slack notifications](#manage-slack-notifications) | Identify inefficiencies in pipeline execution to reduce infrastructure costs and improve timeliness. | <ul><li>What’s the latest status of each model?</li> <li>Do I need to run this model?</li><li>How long did my DAG take to run?</li> </ul>|
| [Rotate account-scoped PAT](#rotate-account-scoped-pat) | Monitor data source freshness and test results to resolve issues and drive trust in data. | <ul><li>How fresh are my data sources?</li><li>Which tests and models failed?</li><li>What’s my project’s test coverage?</li></ul>  |
| [Invite a user to the account](#invite-a-user-to-the-account) | Find and understand relevant datasets and semantic nodes with rich context and metadata. | <ul><li>What do these tables and columns mean?</li><li>What’s the full data lineage?</li><li>Which metrics can I query?</li> </ul> |


## Manage Slack notifications

You can use the Admin API to manage Slack notifications.

## Rotate account-scoped PAT

You can use the Admin API to rotate account-scoped PATs.



## Invite a user to the account

You can use the Admin API to invite a user to the account.


You can use the Discovery API to find and understand relevant datasets and semantic nodes with rich context and metadata. Below are example questions and queries you can run.

For discovery use cases, people typically query the latest applied or definition state, often in the downstream part of the DAG (for example, mart models or metrics), using the `environment` endpoint.

### What does this dataset and its columns mean?

Query the Discovery API to map a table/view in the data platform to the model in the dbt project; then, retrieve metadata about its meaning, including descriptive metadata from its YAML file and catalog information from its YAML file and the schema.

<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(
        first: $first
        filter: {
          database: "analytics"
          schema: "prod"
          identifier: "customers"
        }
      ) {
        edges {
          node {
            name
            description
            tags
            meta
            catalog {
              columns {
                name
                description
                type
              }
            }
          }
        }
      }
    }
  }
}
```
</details>

### Which metrics are available?

You can define and query metrics using the [dbt Semantic Layer](/docs/build/about-metricflow), use them for documentation purposes (like for a data catalog), and calculate aggregations (like in a BI tool that doesn’t query the SL).

<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    definition {
      metrics(first: $first) {
        edges {
          node {
            name
            description
            type
            formula
            filter
            tags
            parents {
              name
              resourceType
            }
          }
        }
      }
    }
  }
}
```

</details>




## Related docs

- [Query Discovery API](/docs/dbt-cloud-apis/discovery-querying)
