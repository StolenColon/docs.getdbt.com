---
title: "Use cases and examples for the Admin API"
sidebar_label: "Uses and examples"
---

With the Admin API, you can administer your dbt Cloud account by accessing its endpoints. Use this API to replicate resources across projects, accounts, and environments, or standardize project creation.

You can use this API in a variety of ways to get answers to your business questions. Answer these questions with the Admin API:

* [How can I create Slack notifications for jobs?](#manage-slack-notifications)
* [How do I rotate account-scoped PATs?](#rotate-account-scoped-pat)
* [How do I invite a user to the account?](#invite-a-user-to-the-account) 

## Finding your account ID


## Managing Slack notifications

You can use the Admin API to create Slack notifications for job successes, failures, or cancelations.

1. Find the Slack channel ID at the bottom of the About page for a Slack channel.
<!-- TODO: Add screenshot -->

2. From Terminal, run the following command:

```bash
curl --request POST \
  --url https://cloud.getdbt.com/api/v2/accounts/<ACCOUNT_ID>/notifications/ \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer <YOUR_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "account_id": <YOUR_ACCOUNT_ID>,
  "user_id": <YOUR_USER_ID>,
  "type": 2, <!-- 1 = internal email, 2 = slack, 3 = deprecated DO NOT USE, 4 = external email -->
  "external_email": "string",
  "slack_channel_id": "string",
  "slack_channel_name": "string",
  "on_cancel": [
    0
  ],
  "on_failure": [
    <JOB_ID1>,
    <JOB_ID2>
  ],
  "on_success": [
    <JOB_ID3>,
    <JOB_ID4>
  ],
  "on_warning": [
    <JOB_ID5>,
    <JOB_ID6>
  ],
  "state": 1
}'
  curl -X POST \
```

## Rotating account-scoped PATs

You can use the Admin API to rotate account-scoped PATs.

## Inviting a user to the account

You can use the Admin API to invite a user to the account.

## Related docs

- [dbt Cloud Admin API](/docs/dbt-cloud-apis/admin-cloud-api)
