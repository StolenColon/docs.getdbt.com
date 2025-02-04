---
title: build_after
description: "Read this guide to understand the build_after configuration in dbt."
---

<VersionCallout version="1.10" />

<Tabs>
<TabItem value="yml" label="Project file">

<File name="dbt_project.yml">
  
```yaml
models:
  [resource-path](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-properties/freshness):
      build_after:  # build this model after X amount of time, as long as it has new data
        count: positive_integer
        period: minute | hour | day
        depends_on: any | all
```
  
</File>
</TabItem>

<TabItem value="project" label="Project YAML">

<File name="models/<filename>.yml">
  
```yml
models:
  - name: stg_orders
    freshness:
      build_after:  # build this model after X amount of time, as long as it has new data
        count: positive_integer
        period: minute | hour | day
        depends_on: any | all
```
  
</File>
</TabItem>

<TabItem value="sql" label="Config block">
<File name="models/<filename>.sql">
  
```sql
{{ config(
    build_after = {     # build this model after X amount of time, as long as it has new data
        "count": positive_integer,
        "period": "minute" | "hour" | "day",
        "depends_on": "any" | "all"
    }
) }}

```
  
</File>
</TabItem>
</Tabs>

<VersionBlock lastVersion="1.9">

This configuration is not available in dbt 1.9 and earlier. To use `build_after`, you must upgrade to dbt 1.10 or later.

</VersionBlock>

## Description

The `build_after` configuration in dbt makes sure that a model is rebuilt in a scheduled job _only if new source or upstream data is available_, helping you reduce unnecessary rebuilds and optimize spend. This is useful for models that depend on other models and need to be updated periodically. This configuration applies only to models.

`build_after` complements dbt Cloud orchestration settings by determining when a model is built in a scheduled job. 👈 tbd since adaptive jobs is at risk

When a scheduled job runs, dbt Cloud uses the `build_after` config to:
- Check if there's new source data to build 
- And whether enough time has passed since the last build, based on the specified `count` and `period`

The configuration consists of the following parts:

| Configuration | Description |
|--------------|-------------|
| `build_after` | Config nested under `freshness`. Used to tell dbt to build model only if it has some new source/upstream data (based on `count`, `period`, and `depends_on`). |
| `count` and `period` | Specify how often dbt should check for new data (for example, `count: 4, period: hour` means dbt will check every 4 hours) |
| `depends_on` | Determines when upstream data changes should trigger a job build. Use the following values:<br />• `any`: The model will build only if _any_ direct upstream node has new data since the last build<br />• `all`: The model will only build only if _all_ direct upstream nodes have new data since the last build |

For sources, dbt considers data "new" based on custom freshness calculations (if configured). If a source's freshness goes past its warning/error threshold, dbt raises a warning/error during the build.

## Default
Default for the `build_after` is:

```yaml
build_after:
  count: 0
  period: minute
  depends_on: all
```

This means that the model will be built every time a scheduled job runs for any amount of new data.

## Examples


- add example of low latency model (reduce spend)
- add example of high latency model
