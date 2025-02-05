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

The `build_after` configuration in dbt helps you rebuild models _only when new source or upstream data is available_, helping you reduce unnecessary rebuilds and optimize spend. This is useful for models that depend on other models and need to be updated periodically. 

`build_after` works alongside dbt Cloud job orchestration by helping you determine when models should be rebuilt in a scheduled job. When a job runs, dbt Cloud:
- Checks if there's new data available for the model
- Ensures enough time has passed since the last build, based on `count` and `period`

This makes sure models run only when needed, helping you avoid overbuilding models unnecessarily.

The configuration consists of the following parts:

| Configuration | Description |
|--------------|-------------|
| `build_after` | Config nested under `freshness`. Used to tell dbt to build model only if it has some new source/upstream data (based on `count`, `period`, and `depends_on`). |
| `count` and `period` | Specify how often dbt should check for new data (for example, `count: 4, period: hour` means dbt will check every 4 hours) |
| `depends_on` | Determines when upstream data changes should trigger a job build. Use the following values:<br /> - `any`: The model will build only if _any_ direct upstream node has new data since the last build. Faster and may increase spend.<br /> - `all`: The model will only build only if _all_ direct upstream nodes have new data since the last build. Less spend and more requirements |

For sources, dbt considers data "new" based on custom freshness calculations (if configured). If a source's freshness goes past its warning/error threshold, dbt raises a warning/error during the build.

## Default
Default for the `build_after` is:

```yaml
build_after:
  count: 0
  period: minute
  depends_on: all
```

This means that by default, the model will be built every time a scheduled job runs for any amount of new data.

## Examples

The following example shows how to configure less frequent and more frequent models.

### Less frequent
If you want to build a model that runs less frequently (which reduces spend), you can configure the model to only build after X amount of time.

Add a `build_after` freshness configuration to the model with `count: 4` and `period: hour`:

```yaml
models:
  - name: stg_wizards
    freshness:
      build_after: 
        count: 4
        period: hour
        depends_on: all
  - name: stg_worlds
    freshness:
      build_after: 
        count: 4
        period: hour
        depends_on: all  
```

WWen the adaptive job kicks off, dbt checks:

- If there's new source data
- As well as whether models `stg_wizards` and `stg_worlds` were already built within the last 4 hour

If _both_ conditions are met, dbt will build the model. Since the `depends_on: all` config is set, it means if `raw.wizards` source has new data, but `stg_wizards` and `stg_worlds` was last built 3 hours ago, nothing would be built.

If `depends_on: any` is set, it means if `raw.wizards` source has new data, dbt will build the model.

### More frequent
If you want to build a model that runs more frequently (which means it might increase spend), you can configure the model to build as soon as _any_ dependency has new data instead of waiting for all dependencies.

Add a `build_after` freshness configuration to the model with `count: 1` and `period: hour`:

```yaml
models:
  - name: stg_wizards
    freshness:
      build_after: 
        count: 1
        period: hour
        depends_on: any
  - name: stg_worlds
    freshness:
      build_after: 
        count: 1
        period: hour
        depends_on: any  

```

When the adaptive job kicks off, dbt checks:

- If new source data is available
- If at least one of `stg_wizards` or `stg_worlds` has been built within the last hour

If _both_ conditions are met, dbt will build the model. This also means if either model (`stg_wizards` _or_ `stg_worlds`) has new data, dbt rebuilds the model. If neither model has new data, nothing will be built.

Since `depends_on: any` in this example, it means if `raw.wizards` source has new data, but only `stg_wizards` was built in the last hour while `stg_worlds` hasn’t been updated, dbt will still build the model because at least one dependency has new incoming data.
