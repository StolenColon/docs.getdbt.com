---
title: "About flags (global configs)"
id: "about-global-configs"
sidebar: "About flags (global configs)"
pagination_next: null
---

In dbt, "flags" (also called "global configs") are configurations for fine-tuning _how_ dbt runs your project. They differ from [resource-specific configs](/reference/configs-and-properties) that tell dbt about _what_ to run.

Flags control things like the visual output of logs, whether to treat specific warning messages as errors, or whether to "fail fast" after encountering the first error. Flags are "global" configs because they are available for all dbt commands and they can be set in multiple places.

There is a significant overlap between dbt's flags and dbt's command line options, but there are differences:
- Certain flags can only be set in [`dbt_project.yml`](/reference/dbt_project.yml) and cannot be overridden for specific invocations via CLI options.
- If a CLI option is supported by specific commands, rather than supported by all commands ("global"), it is generally not considered to be a "flag".

### Setting flags

There are multiple ways of setting flags, which depend on the use case:
- **[Project-level `flags` in `dbt_project.yml`](/reference/global-configs/project-flags):** Define version-controlled defaults for everyone running this project. Also, opt in or opt out of [behavior changes](/reference/global-configs/behavior-changes) to manage your migration off legacy functionality.
- **[Environment variables](/reference/global-configs/environment-variable-configs):** Define different behavior in different runtime environments (development vs. production vs. [continuous integration](/docs/deploy/continuous-integration), or different behavior for different users in development (based on personal preferences).
- **[CLI options](/reference/global-configs/command-line-options):** Define behavior specific to _this invocation_. Supported for all dbt commands.

The most specific setting "wins." If you set the same flag in all three places, the CLI option will take precedence, followed by the environment variable, and finally, the value in `dbt_project.yml`. If you set the flag in none of those places, it will use the default value defined within dbt.

Most flags can be set in all three places:
```yaml
# dbt_project.yml
flags:
  # set default for running this project -- anywhere, anytime, by anyone
  fail_fast: true
```
```bash
# set this environment variable to 'True' (bash syntax)
export DBT_FAIL_FAST=1
dbt run
```
```bash
dbt run --fail-fast # set to True for this specific invocation
dbt run --no-fail-fast # set to False
```

There are two categories of exceptions:
1. **Flags setting file paths:** Flags for file paths that are relevant to runtime execution (for example, `--log-path` or `--state`) cannot be set in `dbt_project.yml`. To override defaults, pass CLI options or set environment variables (`DBT_LOG_PATH`, `DBT_STATE`). Flags that tell dbt where to find project resources (for example, `model-paths`) are set in `dbt_project.yml`, but as a top-level key, outside the `flags` dictionary; these configs are expected to be fully static and never vary based on the command or execution environment.
2. **Opt-in flags:** Flags opting in or out of [behavior changes](/reference/global-configs/behavior-changes) can _only_ be defined in `dbt_project.yml`. These are intended to be set in version control and migrated via pull/merge request. Their values should not diverge indefinitely across invocations, environments, or users.

### Accessing flags

Custom user-defined logic, written in Jinja, can check the values of flags using [the `flags` context variable](/reference/dbt-jinja-functions/flags).

```yaml
# dbt_project.yml

on-run-start:
  - '{{ log("I will stop at the first sign of trouble", info = true) if flags.FAIL_FAST }}'
```

Because the values of `flags` can differ across invocations, we strongly advise against using `flags` as an input to configurations or dependencies (`ref` + `source`) that dbt resolves [during parsing](/reference/parsing#known-limitations).

## Available flags

|  <div style={{width:'100px'}}>Flag</div>  |  <div style={{width:'100px'}}>Type and Default</div>  |  <div style={{width:'100px'}}>Support</div>  |  <div style={{width:'150px'}}>Env variable</div>  |  <div style={{width:'150px'}}>CLI Option</div>  |  
|----------------------------|-----------------|--------------------|-------------------|---------------------|
| [cache_selected_only](/reference/global-configs/cache) | Boolean <br /> False  | Project ✅ <br /> Cloud CLI ✅   | `DBT_CACHE_SELECTED_ONLY`  | `--cache-selected-only`, `--no-cache-selected-only`     | 
| [debug](/reference/global-configs/logs#debug-level-logging) | Boolean <br /> False           | Project ✅ <br /> Cloud CLI ✅   | `DBT_DEBUG`    | `--debug`, `--no-debug`    | 
| [defer](/reference/node-selection/defer) | Boolean <br /> False   | Project ❌ <br /><br /> Cloud CLI ✅ (enabled by default)   | `DBT_DEFER`  | `--defer`, `--no-defer`|
| [defer_state](/reference/node-selection/defer)| Path <br /> None | Project ❌ <br /> Cloud CLI ❌   | `DBT_DEFER_STATE`  | `--defer-state`| 
| [fail_fast](/reference/global-configs/failing-fast)| Boolean <br /> False| Project ✅ <br /> Cloud CLI ✅   | `DBT_FAIL_FAST`   | `--fail-fast`, `-x`, `--no-fail-fast`| 
| [full_refresh](/reference/resource-configs/full_refresh) | Boolean <br /> False| Project ✅ (as resource config)<br /><br /> Cloud CLI ✅   | `DBT_FULL_REFRESH` | `--full-refresh`, `--no-full-refresh`| 
| [indirect_selection](/reference/node-selection/test-selection-examples#syntax-examples) | Enum <br /> eager | Project ✅ <br /> Cloud CLI ❌   | `DBT_INDIRECT_SELECTION` | `--indirect-selection`| 
| [introspect](/reference/commands/compile#introspective-queries) | Boolean <br /> True| Project ❌ <br /> Cloud CLI ❌   | `DBT_INTROSPECT` | `--introspect`, `--no-introspect` | 
| [log_cache_events](/reference/global-configs/logs#logging-relational-cache-events) | Boolean <br /> False | Project ❌ <br /> Cloud CLI ❌   | `DBT_LOG_CACHE_EVENTS`| `--log-cache-events`, `--no-log-cache-events`| 
| [log_format_file](/reference/global-configs/logs#log-formatting) | Enum <br /> Default (text)  | Project ✅ <br /> Cloud CLI ❌   | `DBT_LOG_FORMAT_FILE` | `--log-format-file` | 
| [log_format](/reference/global-configs/logs#log-formatting) | Enum <br /> Default (text)  | Project ✅ <br /> Cloud CLI ❌   | `DBT_LOG_FORMAT` | `--log-format` | 
| [log_level_file](/reference/global-configs/logs#log-level) | Enum <br /> debug | Project ✅ <br /> Cloud CLI ❌   | `DBT_LOG_LEVEL_FILE` | `--log-level-file` | 
| [log_level](/reference/global-configs/logs#log-level) | Enum <br /> info| Project ✅ <br /> Cloud CLI ❌   | `DBT_LOG_LEVEL` | `--log-level`  |
| [log_path](/reference/global-configs/logs) | Path <br /> None (uses `logs/`)  | Project ❌ <br /> Cloud CLI ❌   | `DBT_LOG_PATH` | `--log-path`  |
| [partial_parse](/reference/global-configs/parsing#partial-parsing) | Boolean <br /> True  | Project ✅ <br /> Cloud CLI ✅   | `DBT_PARTIAL_PARSE`  | `--partial-parse`, `--no-partial-parse`  | 
| [populate_cache](/reference/global-configs/cache) | Boolean <br /> True | Project ✅ <br /> Cloud CLI ✅   | `DBT_POPULATE_CACHE`| `--populate-cache`, `--no-populate-cache`| 
| [print](/reference/global-configs/print-output#suppress-print-messages-in-stdout) | Boolean <br /> True| Project ❌ <br /> Cloud CLI ❌   | `DBT_PRINT`  | `--print` | 
| [printer_width](/reference/global-configs/print-output#printer-width) | Int <br /> 80 | Project ✅ <br /> Cloud CLI ❌   | `DBT_PRINTER_WIDTH`             | `--printer-width` | 
| [profile](/docs/core/connect-data-platform/connection-profiles#about-profiles) | String <br /> None | Project ✅ (as top-level key) <br /><br /> Cloud CLI ❌   | `DBT_PROFILE` | `--profile`| 
| [profiles_dir](/docs/core/connect-data-platform/connection-profiles#about-profiles) | Path <br /> None (current dir, then HOME dir)| Project ❌ <br /> Cloud CLI ❌   | `DBT_PROFILES_DIR` | `--profiles-dir`  |
| [project_dir](/reference/dbt_project.yml) | Path <br /> None | Project ❌ <br /> Cloud CLI ❌   | `DBT_PROJECT_DIR`| `--project-dir`  |
| [quiet](/reference/global-configs/logs#suppress-non-error-logs-in-output) | Boolean <br />  False | Project ❌ <br /> Cloud CLI ✅   | `DBT_QUIET`| `--quiet` |
| [resource-type](/reference/global-configs/resource-type) (v1.8+) | String <br /> None  | Project ❌ <br /> Cloud CLI ✅   | `DBT_RESOURCE_TYPES`,<br /> `DBT_EXCLUDE_RESOURCE_TYPES` | `--resource-type`, `--exclude-resource-type`  |
| [send_anonymous_usage_stats](/reference/global-configs/usage-stats) | Boolean <br /> True| Project ✅ <br /> Cloud CLI ❌   | `DBT_SEND_`<br/>`ANONYMOUS_USAGE_STATS` | `--send-anonymous-usage-stats`, `--no-send-anonymous-usage-stats` |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-changes#source_freshness_run_project_hooks) | Boolean <br /> False | Project ✅ <br /> Cloud CLI ❌ | N/A | N/A | 
| [state](/reference/node-selection/defer) | Path <br /> None  | Project ❌ <br /> Cloud CLI ❌   | `DBT_STATE`, `DBT_DEFER_STATE`     | `--state`, `--defer-state`  | `dbt run`, `dbt test`, `dbt build`  ???? |
| [static_parser](/reference/global-configs/parsing#static-parser)  |Boolean <br /> True  | Project ✅ <br /> Cloud CLI ❌   | `DBT_STATIC_PARSER`                | `--static-parser`, `--no-static-parser` | 
| [store_failures](/reference/resource-configs/store_failures) | Boolean <br /> False | Project ✅ (as resource config) <br /> Cloud CLI ✅   | `DBT_STORE_FAILURES` | `--store-failures`, `--no-store-failures`|  ???    |
| [target_path](/reference/global-configs/json-artifacts) | Path <br /> None (uses `target/`)  Project ❌ <br /> Cloud CLI ❌   | `DBT_TARGET_PATH`                  | `--target-path`  |  
| [target](/docs/core/connect-data-platform/connection-profiles#about-profiles) | String <br /> None   | Project ✅ (as top-level key) <br /><br /> Cloud CLI ❌   | `DBT_TARGET`  | `--target`  |
| [use_colors_file](/reference/global-configs/logs#color) | Boolean <br /> True | Project ✅ <br /> Cloud CLI ❌   | `DBT_USE_COLORS_FILE`                | `--use-colors-file`, `--no-use-colors-file`   |
| [use_colors](/reference/global-configs/print-output#print-color) | Boolean <br /> True | Project ✅ <br /> Cloud CLI ❌   | `DBT_USE_COLORS`                | `--use-colors`, `--no-use-colors`  |
| [use_experimental_parser](/reference/global-configs/parsing#experimental-parser) | Boolean <br /> False  | Project ✅ <br /> Cloud CLI ❌   | `DBT_USE_`<br />`EXPERIMENTAL_PARSER`| `--use-experimental-parser`, `--no-use-experimental-parser`  |
| [version_check](/reference/global-configs/version-compatibility) | Boolean <br /> varies| Project ✅ <br /> Cloud CLI ❌   | `DBT_VERSION_CHECK`                | `--version-check`, `--no-version-check`  |
| [warn_error_options](/reference/global-configs/warnings) | dict <br /> {} | Project ✅ <br /> Cloud CLI ✅  | `DBT_WARN_ERROR_OPTIONS`                | `--warn-error-options` |
| [warn_error](/reference/global-configs/warnings) | Boolean <br /> False | Project ✅ <br /> Cloud CLI ✅   | `DBT_WARN_ERROR`  | `--warn-error`  |
| [write_json](/reference/global-configs/json-artifacts) | Boolean <br /> True | Project ✅ <br /> Cloud CLI ✅   | `DBT_WRITE_JSON` | `--write-json`, `--no-write-json` |

## Available flags for commands

| **Command**           | **Supported flags**    |
| --------------------|----------------------|
| `dbt build`           | `cache_selected_only`, `debug`, `defer`, `defer_state`, `fail_fast`, `full_refresh`, `exclude`, `profiles_dir`, `project_dir`, `resource_type`, `exclude_resource_type`, `select`, `selector`, `show`, `store_failures`, `target_path`, `threads`, `vars`                                                |
| `dbt clean`           | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `target_path`, `vars`, `clean_project_files_only`                                                                                                                                                                                         |
| `dbt docs generate`   | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `select`, `selector`, `compile_docs`, `empty_catalog`, `static`, `target_path`, `threads`, `vars`                                                                                                                                           |
| `dbt docs serve`      | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `target_path`, `vars`, `browser`, `host`, `port`                                                                                                                                                                                           |
| `dbt compile`         | `cache_selected_only`, `debug`, `defer`, `defer_state`, `fail_fast`, `full_refresh`, `exclude`, `profiles_dir`, `project_dir`, `select`, `selector`, `threads`, `target_path`, `vars`, `inline`, `show_output_format`, `compile_inject_ephemeral_ctes`, `introspect`                                      |
| `dbt show`            | **Incorrect in original table**: It does **not** support `defer`, `defer_state`, or `fail_fast`. Corrected to: `cache_selected_only`, `debug`, `exclude`, `profiles_dir`, `project_dir`, `select`, `selector`, `threads`, `target_path`, `vars`, `inline`, `inline_direct`. `show_limit`, `introspect`, `show_output_format`   |
| `dbt debug`           | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `debug_connection`, `config_dir`, `profiles_dir_exists_false`                                                                                                                                                                      |
| `dbt deps`            | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `source`, `lock`, `upgrade`, `add_package`                                                                                                                                                                                         |
| `dbt init`            | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `skip_profile_setup`, `project_name`                                                                                                                                                                                              |
| `dbt list`            | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `exclude`, `models`, `output`, `output_keys`, `resource_type`, `exclude_resource_type`, `raw_select`, `selector`, `target_path`                                                                                                   |
| `dbt parse`           | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `threads`, `target_path`                                                                                                                                                                                                           |
| `dbt run`             | `cache_selected_only`, `debug`, `defer`, `defer_state`, `fail_fast`, `full_refresh`, `exclude`, `profiles_dir`, `project_dir`, `select`, `selector`, `threads`, `target_path`, `vars`, `empty`, `event_time_start`, `event_time_end`                                                                      |
| `dbt retry`           | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `threads`, `target_path`, `full_refresh`                                                                                                                                                                                          |
| `dbt clone`           | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `select`, `selector`, `threads`, `target_path`, `exclude`, `resource_type`, `exclude_resource_type`, `full_refresh`                                                                                                               |
| `dbt run-operation`   | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `vars`, `threads`, `target_path`, `args`, `macro`                                                                                                                                                                                         |
| `dbt seed`            | `cache_selected_only`, `debug`, `full_refresh`, `profiles_dir`, `project_dir`, `select`, `selector`, `show`, `threads`, `target_path`, `vars`                                                                                                                                                            |
| `dbt snapshot`        | `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `select`, `selector`, `threads`, `target_path`, `vars`, `empty`, `exclude`                                                                                                                                                                 |
| `dbt source freshness`| `cache_selected_only`, `debug`, `profiles_dir`, `project_dir`, `select`, `selector`, `threads`, `target_path`, `vars`, `output_path`, `exclude`                                                                                                                                                           |
| `dbt test`            | `cache_selected_only`, `debug`, `defer`, `defer_state`, `fail_fast`, `profiles_dir`, `project_dir`, `select`, `selector`, `threads`, `target_path`, `vars`, `store_failures`, `exclude`, `resource_type`, `exclude_resource_type`                                                                          |
