---

---

## Why does structure matter?

Analytics engineering, at its core, is about helping groups of human beings collaborate on better decisions at scale. We have [limited bandwidth for making decisions](https://en.wikipedia.org/wiki/Decision_fatigue). We also, as a cooperative social species, rely on [systems and patterns to optimize collaboration](https://en.wikipedia.org/wiki/Pattern_language) with others. This combination of traits means that for collaborative projects it's crucial to establish consistent and comprehensible norms such that your team’s limited bandwidth for decision making can be spent on unique and difficult problems, not deciding where folders should go or how to name files.

Building a great dbt project is an inherently collaborative endeavor, bringing together domain knowledge from every department to map the goals and narratives of the entire company. As such, it's especially important to establish a deep and broad set of patterns to ensure as many people as possible are empowered to leverage their particular expertise in a positive way, and to ensure that the project remains approachable and maintainable as your organization scales.

Famously, Steve Jobs [wore the same outfit everyday](https://images.squarespace-cdn.com/content/v1/5453c539e4b02ab5398ffc8f/1580381503218-E56FQDNFL1P4OBLQWHWW/ke17ZwdGBToddI8pDm48kJKedFpub2aPqa33K4gNUDwUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcxb5ZTIyC_D49_DDQq2Sj8YVGtM7O1i4h5tvKa2lazN4nGUQWMS_WcPM-ztWbVr-c/steve_jobs_outfit.jpg) to reduce decision fatigue. You can think of this guide similarly, as a black turtleneck and New Balance sneakers for your company’s dbt project. A dbt project’s power outfit, or more accurately its structure, is composed not of fabric but of files, folders, naming conventions, and programming patterns. How you label things, group them, split them up, or bring them together — the system you use to organize the [data transformations](https://www.getdbt.com/analytics-engineering/transformation/) encoded in your dbt project — this is your project’s structure.

This guide is just a starting point. You may decide that you prefer Birkenstocks or a purple hoodie for your project over Jobs-ian minimalism. That's fine. What's important is that you think through the reasoning for those changes in your organization, explicitly declare them in a thorough, accessible way for all contributors, and above all _stay consistent_.

One foundational principle that applies to all dbt projects though, is the need to establish a cohesive arc moving data from _source-conformed_ to _business-conformed_. Source-conformed data is shaped by external systems out of our control, while business-conformed data is shaped by the needs, concepts, and definitions we create. No matter what patterns or conventions you define within your project, this process remains the essential purpose of the transformation layer, and dbt as your tool within it. This guide is an update to a seminal analytics engineering [post of the same name](https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355) by the great Claire Carroll, and while some of the details have changed over time (as anticipated in that post) this fundamental trajectory holds true. Moving forward, this guide will be iteratively updated as new tools expand our viewpoints, new experiences sharpen our vision, and new voices strengthen our perspectives, but always in service of that aim.

## Learning goals

This guide has three main goals:

- Thoroughly cover our most up-to-date recommendations on how to structure typical dbt projects
- Illustrate these recommendations with comprehensive examples
- At each stage, explain _why_ we recommend the approach that we do, so that you're equipped to decide when and where to deviate from these recommendations to better fit your organization’s unique needs

You should walk away from this guide with a deeper mental model of how the components of a dbt project fit together, such that purpose and principles of analytics engineering feel more clear and intuitive.

By approaching our structure intentionally, we’ll gain a better understanding of foundational ideals like moving our data from the wide array of narrower source-conformed models that our systems give us to a narrower set of wider, richer business-conformed designs we create. As we move along that arc, we’ll understand how stacking our transformations in optimized, modular layers means we can apply each transformation in only one place. With a disciplined approach to the files, folders, and materializations that comprise our structure, we’ll find that we can create clear stories not only through our data, but also our codebase and the artifacts it generates in our warehouse.

Our hope is that by deepening your sense of the connections between these patterns and the principles they flow from, you'll be able to translate them to fit your specific needs and craft customized documentation for your team to act on.

:::info Example project.
This guide walks through our recommendations using a very simple dbt project — similar to the one used for the Getting Started guide and many other demos — from a fictional company called the Jaffle Shop. You can read more about [jaffles](https://en.wiktionary.org/wiki/jaffle) if you want (they _are_ a real thing), but that context isn’t important to understand the structure. We encourage you to follow along, try things out, make changes, and take notes on what works or doesn't work for you along the way.
:::

We'll get a deeper sense of our project as we move through the guide, but for now we just need to know that the Jaffle Shop is a restaurant selling jaffles that has two main data sources:

- A replica of our transactional database, called `jaffle_shop`, with core entities like orders and customers.
- Synced data from [Stripe](https://stripe.com/), which we use for processing payments.

### Guide structure overview

We'll walk through our topics in the same order that our data would move through transformation:

1. Dig into how we structure the files, folders, and models for our three primary layers in the `models` directory, which build on each other:
   1. **Staging** — creating our atoms, our initial modular building blocks, from source data
   2. **Intermediate** — stacking layers of logic with clear and specific purposes to prepare our staging models to join into the entities we want
   3. **Marts** — bringing together our modular pieces into a wide, rich vision of the entities our organization cares about
2. Explore how these layers fit into the rest of the project:
   1. Review the overall structure comprehensively
   2. Expand on YAML configuration in-depth
   3. Discuss how to use the other folders in a dbt project: `tests`, `seeds`, and `analyses`

Below is the complete file tree of the project we’ll be working through. Don’t worry if this looks like a lot of information to take in at once - this is just to give you the full vision of what we’re building towards. We’ll focus in on each of the sections one by one as we break down the project’s structure.

```shell
jaffle_shop
├── README.md
├── analyses
├── seeds
│   └── employees.csv
├── dbt_project.yml
├── macros
│   └── cents_to_dollars.sql
├── models
│   ├── intermediate
│   │   └── finance
│   │       ├── _int_finance__models.yml
│   │       └── int_payments_pivoted_to_orders.sql
│   ├── marts
│   │   ├── finance
│   │   │   ├── _finance__models.yml
│   │   │   ├── orders.sql
│   │   │   └── payments.sql
│   │   └── marketing
│   │       ├── _marketing__models.yml
│   │       └── customers.sql
│   ├── staging
│   │   ├── jaffle_shop
│   │   │   ├── _jaffle_shop__docs.md
│   │   │   ├── _jaffle_shop__models.yml
│   │   │   ├── _jaffle_shop__sources.yml
│   │   │   ├── base
│   │   │   │   ├── base_jaffle_shop__customers.sql
│   │   │   │   └── base_jaffle_shop__deleted_customers.sql
│   │   │   ├── stg_jaffle_shop__customers.sql
│   │   │   └── stg_jaffle_shop__orders.sql
│   │   └── stripe
│   │       ├── _stripe__models.yml
│   │       ├── _stripe__sources.yml
│   │       └── stg_stripe__payments.sql
│   └── utilities
│       └── all_dates.sql
├── packages.yml
├── snapshots
└── tests
    └── assert_positive_value_for_total_amount.sql
```


The staging layer is where our journey begins. This is the foundation of our project, where we bring all the individual components we're going to use to build our more complex and useful models into the project.

We'll use an analogy for working with dbt throughout this guide: thinking modularly in terms of atoms, molecules, and more complex outputs like proteins or cells (we apologize in advance to any chemists or biologists for our inevitable overstretching of this metaphor). Within that framework, if our source system data is a soup of raw energy and quarks, then you can think of the staging layer as condensing and refining this material into the individual atoms we’ll later build more intricate and useful structures with.

## Staging: Files and folders

Let's zoom into the staging directory from our `models` file tree [in the overview](/best-practices/how-we-structure/1-guide-overview) and walk through what's going on here.

```shell
models/staging
├── jaffle_shop
│   ├── _jaffle_shop__docs.md
│   ├── _jaffle_shop__models.yml
│   ├── _jaffle_shop__sources.yml
│   ├── base
│   │   ├── base_jaffle_shop__customers.sql
│   │   └── base_jaffle_shop__deleted_customers.sql
│   ├── stg_jaffle_shop__customers.sql
│   └── stg_jaffle_shop__orders.sql
└── stripe
    ├── _stripe__models.yml
    ├── _stripe__sources.yml
    └── stg_stripe__payments.sql
```

- **Folders.** Folder structure is extremely important in dbt. Not only do we need a consistent structure to find our way around the codebase, as with any software project, but our folder structure is also one of the key interfaces for understanding the knowledge graph encoded in our project (alongside the DAG and the data output into our warehouse). It should reflect how the data flows, step-by-step, from a wide variety of source-conformed models into fewer, richer business-conformed models. Moreover, we can use our folder structure as a means of selection in dbt [selector syntax](https://docs.getdbt.com/reference/node-selection/syntax). For example, with the above structure, if we got fresh Stripe data loaded and wanted to run all the models that build on our Stripe data, we can easily run `dbt build --select staging.stripe+` and we’re all set for building more up-to-date reports on payments.
  - ✅ **Subdirectories based on the source system**. Our internal transactional database is one system, the data we get from Stripe's API is another, and lastly the events from our Snowplow instrumentation. We've found this to be the best grouping for most companies, as source systems tend to share similar loading methods and properties between tables, and this allows us to operate on those similar sets easily.
  - ❌ **Subdirectories based on loader.** Some people attempt to group by how the data is loaded (Fivetran, Stitch, custom syncs), but this is too broad to be useful on a project of any real size.
  - ❌ **Subdirectories based on business grouping.** Another approach we recommend against is splitting up by business groupings in the staging layer, and creating subdirectories like 'marketing', 'finance', etc. A key goal of any great dbt project should be establishing a single source of truth. By breaking things up too early, we open ourselves up to creating overlap and conflicting definitions (think marketing and financing having different fundamental tables for orders). We want everybody to be building with the same set of atoms, so in our experience, starting our transformations with our staging structure reflecting the source system structures is the best level of grouping for this step.
- **File names.** Creating a consistent pattern of file naming is [crucial in dbt](https://docs.getdbt.com/blog/on-the-importance-of-naming). File names must be unique and correspond to the name of the model when selected and created in the warehouse. We recommend putting as much clear information into the file name as possible, including a prefix for the layer the model exists in, important grouping information, and specific information about the entity or transformation in the model.
  - ✅ `stg_[source]__[entity]s.sql` - the double underscore between source system and entity helps visually distinguish the separate parts in the case of a source name having multiple words. For instance, `google_analytics__campaigns` is always understandable, whereas to somebody unfamiliar `google_analytics_campaigns` could be `analytics_campaigns` from the `google` source system as easily as `campaigns` from the `google_analytics` source system. Think of it like an [oxford comma](https://www.youtube.com/watch?v=P_i1xk07o4g), the extra clarity is very much worth the extra punctuation.
  - ❌ `stg_[entity].sql` - might be specific enough at first, but will break down in time. Adding the source system into the file name aids in discoverability, and allows understanding where a component model came from even if you aren't looking at the file tree.
  - ✅ **Plural.** SQL, and particularly SQL in dbt, should read as much like prose as we can achieve. We want to lean into the broad clarity and declarative nature of SQL when possible. As such, unless there’s a single order in your `orders` table, plural is the correct way to describe what is in a table with multiple rows.

### Staging: Models

Now that we’ve got a feel for how the files and folders fit together, let’s look inside one of these files and dig into what makes for a well-structured staging model.

Below, is an example of a standard staging model (from our `stg_stripe__payments` model) that illustrates the common patterns within the staging layer. We’ve organized our model into two <Term id='cte'>CTEs</Term>: one pulling in a source table via the [source macro](https://docs.getdbt.com/docs/build/sources#selecting-from-a-source) and the other applying our transformations.

While our later layers of transformation will vary greatly from model to model, every one of our staging models will follow this exact same pattern. As such, we need to make sure the pattern we’ve established is rock solid and consistent.

```sql
-- stg_stripe__payments.sql

with

source as (

    select * from {{ source('stripe','payment') }}

),

renamed as (

    select
        -- ids
        id as payment_id,
        orderid as order_id,

        -- strings
        paymentmethod as payment_method,
        case
            when payment_method in ('stripe', 'paypal', 'credit_card', 'gift_card') then 'credit'
            else 'cash'
        end as payment_type,
        status,

        -- numerics
        amount as amount_cents,
        amount / 100.0 as amount,

        -- booleans
        case
            when status = 'successful' then true
            else false
        end as is_completed_payment,

        -- dates
        date_trunc('day', created) as created_date,

        -- timestamps
        created::timestamp_ltz as created_at

    from source

)

select * from renamed
```

- Based on the above, the most standard types of staging model transformations are:
  - ✅ **Renaming**
  - ✅ **Type casting**
  - ✅ **Basic computations** (e.g. cents to dollars)
  - ✅ **Categorizing** (using conditional logic to group values into buckets or booleans, such as in the `case when` statements above)
  - ❌ **Joins** — the goal of staging models is to clean and prepare individual source-conformed concepts for downstream usage. We're creating the most useful version of a source system table, which we can use as a new modular component for our project. In our experience, joins are almost always a bad idea here — they create immediate duplicated computation and confusing relationships that ripple downstream — there are occasionally exceptions though (refer to [base models](#staging-other-considerations) for more info).
  - ❌ **Aggregations** — aggregations entail grouping, and we're not doing that at this stage. Remember - staging models are your place to create the building blocks you’ll use all throughout the rest of your project — if we start changing the grain of our tables by grouping in this layer, we’ll lose access to source data that we’ll likely need at some point. We just want to get our individual concepts cleaned and ready for use, and will handle aggregating values downstream.
- ✅ **Materialized as views.** Looking at a partial view of our `dbt_project.yml` below, we can see that we’ve configured the entire staging directory to be materialized as <Term id='view'>views</Term>. As they’re not intended to be final artifacts themselves, but rather building blocks for later models, staging models should typically be materialized as views for two key reasons:

  - Any downstream model (discussed more in [marts](/best-practices/how-we-structure/4-marts)) referencing our staging models will always get the freshest data possible from all of the component views it’s pulling together and materializing
  - It avoids wasting space in the warehouse on models that are not intended to be queried by data consumers, and thus do not need to perform as quickly or efficiently

    ```yaml
    # dbt_project.yml

    models:
      jaffle_shop:
        staging:
          +materialized: view
    ```

- Staging models are the only place we'll use the [`source` macro](/docs/build/sources), and our staging models should have a 1-to-1 relationship to our source tables. That means for each source system table we’ll have a single staging model referencing it, acting as its entry point — _staging_ it — for use downstream.

:::tip Don’t Repeat Yourself.
Staging models help us keep our code <Term id='dry'>DRY</Term>. dbt's modular, reusable structure means we can, and should, push any transformations that we’ll always want to use for a given component model as far upstream as possible. This saves us from potentially wasting code, complexity, and compute doing the same transformation more than once. For instance, if we know we always want our monetary values as floats in dollars, but the source system is integers and cents, we want to do the division and type casting as early as possible so that we can reference it rather than redo it repeatedly downstream.
:::

This is a welcome change for many of us who have become used to applying the same sets of SQL transformations in many places out of necessity! For us, the earliest point for these 'always-want' transformations is the staging layer, the initial entry point in our transformation process. The DRY principle is ultimately the litmus test for whether transformations should happen in the staging layer. If we'll want them in every downstream model and they help us eliminate repeated code, they're probably okay.

## Staging: Other considerations

- **Base models when joins are necessary to stage concepts.** Sometimes, in order to maintain a clean and <Term id='dry'>DRY</Term> staging layer we do need to implement some joins to create a solid concept for our building blocks. In these cases, we recommend creating a sub-directory in the staging directory for the source system in question and building `base` models. These have all the same properties that would normally be in the staging layer, they will directly source the raw data and do the non-joining transformations, then in the staging models we’ll join the requisite base models. The most common use cases for building a base layer under a staging folder are:

  - ✅ **Joining in separate delete tables**. Sometimes a source system might store deletes in a separate table. Typically we’ll want to make sure we can mark or filter out deleted records for all our component models, so we’ll need to join these delete records up to any of our entities that follow this pattern. This is the example shown below to illustrate.

    ```sql
    -- base_jaffle_shop__customers.sql

    with

    source as (

        select * from {{ source('jaffle_shop','customers') }}

    ),

    customers as (

        select
            id as customer_id,
            first_name,
            last_name

        from source

    )

    select * from customers
    ```

    ```sql
    -- base_jaffle_shop__deleted_customers.sql

    with

    source as (

        select * from {{ source('jaffle_shop','customer_deletes') }}

    ),

    deleted_customers as (

        select
            id as customer_id,
            deleted as deleted_at

        from source

    )

    select * from deleted_customers
    ```

    ```sql
    -- stg_jaffle_shop__customers.sql

    with

    customers as (

        select * from {{ ref('base_jaffle_shop__customers') }}

    ),

    deleted_customers as (

        select * from {{ ref('base_jaffle_shop__deleted_customers') }}

    ),

    join_and_mark_deleted_customers as (

        select
            customers.*,
            case
                when deleted_customers.deleted_at is not null then true
                else false
            end as is_deleted

        from customers

        left join deleted_customers on customers.customer_id = deleted_customers.customer_id

    )

    select * from join_and_mark_deleted_customers
    ```

  - ✅ **Unioning disparate but symmetrical sources**. A typical example here would be if you operate multiple ecommerce platforms in various territories via a SaaS platform like Shopify. You would have perfectly identical schemas, but all loaded separately into your warehouse. In this case, it’s easier to reason about our orders if _all_ of our shops are unioned together, so we’d want to handle the unioning in a base model before we carry on with our usual staging model transformations on the (now complete) set — you can dig into [more detail on this use case here](https://discourse.getdbt.com/t/unioning-identically-structured-data-sources/921).

- **[Codegen](https://github.com/dbt-labs/dbt-codegen) to automate staging table generation.** It’s very good practice to learn to write staging models by hand, they’re straightforward and numerous, so they can be an excellent way to absorb the dbt style of writing SQL. Also, we’ll invariably find ourselves needing to add special elements to specific models at times — for instance, in one of the situations above that require base models — so it’s helpful to deeply understand how they work. Once that understanding is established though, because staging models are built largely following the same rote patterns and need to be built 1-to-1 for each source table in a source system, it’s preferable to start automating their creation. For this, we have the [codegen](https://github.com/dbt-labs/dbt-codegen) package. This will let you automatically generate all the source YAML and staging model boilerplate to speed up this step, and we recommend using it in every project.
- **Utilities folder.** While this is not in the `staging` folder, it’s useful to consider as part of our fundamental building blocks. The `models/utilities` directory is where we can keep any general purpose models that we generate from macros or based on seeds that provide tools to help us do our modeling, rather than data to model itself. The most common use case is a [date spine](https://github.com/dbt-labs/dbt-utils#date_spine-source) generated with [the dbt utils package](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/).

:::info Development flow versus DAG order.
This guide follows the order of the DAG, so we can get a holistic picture of how these three primary layers build on each other towards fueling impactful data products. It’s important to note though that developing models does not typically move linearly through the DAG. Most commonly, we should start by mocking out a design in a spreadsheet so we know we’re aligned with our stakeholders on output goals. Then, we’ll want to write the SQL to generate that output, and identify what tables are involved. Once we have our logic and dependencies, we’ll make sure we’ve staged all the necessary atomic pieces into the project, then bring them together based on the logic we wrote to generate our mart. Finally, with a functioning model flowing in dbt, we can start refactoring and optimizing that mart. By splitting the logic up and moving parts back upstream into intermediate models, we ensure all of our models are clean and readable, the story of our DAG is clear, and we have more surface area to apply thorough testing.
:::

Once we’ve got our atoms ready to work with, we’ll set about bringing them together into more intricate, connected molecular shapes. The intermediate layer is where these molecules live, creating varied forms with specific purposes on the way towards the more complex proteins and cells we’ll use to breathe life into our data products.

## Intermediate: Files and folders

Let’s take a look at the intermediate layer of our project to understand the purpose of this stage more concretely.

```shell
models/intermediate
└── finance
    ├── _int_finance__models.yml
    └── int_payments_pivoted_to_orders.sql
```

- **Folders**
  - ✅ **Subdirectories based on business groupings.** Much like the staging layer, we’ll house this layer of models inside their own `intermediate` subfolder. Unlike the staging layer, here we shift towards being business-conformed, splitting our models up into subdirectories not by their source system, but by their area of business concern.
- **File names**
  - `✅ int_[entity]s_[verb]s.sql` - the variety of transformations that can happen inside of the intermediate layer makes it harder to dictate strictly how to name them. The best guiding principle is to think about _verbs_ (e.g. `pivoted`, `aggregated_to_user`, `joined`, `fanned_out_by_quantity`, `funnel_created`, etc.) in the intermediate layer. In our example project, we use an intermediate model to pivot payments out to the order grain, so we name our model `int_payments_pivoted_to_orders`. It’s easy for anybody to quickly understand what’s happening in that model, even if they don’t know [SQL](https://mode.com/sql-tutorial/). That clarity is worth the long file name. It’s important to note that we’ve dropped the double underscores at this layer. In moving towards business-conformed concepts, we no longer need to separate a system and an entity and simply reference the unified entity if possible. In cases where you need intermediate models to operate at the source system level (e.g. `int_shopify__orders_summed`, `int_core__orders_summed` which you would later union), you’d preserve the double underscores. Some people like to separate the entity and verbs with double underscores as well. That’s a matter of preference, but in our experience, there is often an intrinsic connection between entities and verbs in this layer that make that difficult to maintain.

:::tip Don’t over-optimize too early!
The example project is very simple for illustrative purposes. This level of division in our post-staging layers is probably unnecessary when dealing with these few models. Remember, our goal is a _single_ _source of truth._ We don’t want finance and marketing operating on separate `orders` models, we want to use our dbt project as a means to bring those definitions together! As such, don’t split and optimize too early. If you have less than 10 marts models and aren’t having problems developing and using them, feel free to forego subdirectories completely (except in the staging layer, where you should always implement them as you add new source systems to your project) until the project has grown to really need them. Using dbt is always about bringing simplicity to complexity.
:::

### Intermediate: Models

Below is the lone intermediate model from our small example project. This represents an excellent use case per our principles above, serving a clear single purpose: grouping and pivoting a staging model to different grain. It utilizes a bit of Jinja to make the model DRY-er (striving to be DRY applies to the code we write inside a single model in addition to transformations across the codebase), but don’t be intimidated if you’re not quite comfortable with [Jinja](/docs/build/jinja-macros) yet. Looking at the name of the <Term id="cte">CTE</Term>, `pivot_and_aggregate_payments_to_order_grain` we get a very clear idea of what’s happening inside this block. By descriptively labeling the transformations happening inside our CTEs within model, just as we do with our files and folders, even a stakeholder who doesn’t know SQL would be able to grasp the purpose of this section, if not the code. As you begin to write more complex transformations moving out of the staging layer, keep this idea in mind. In the same way our models connect into a DAG and tell the story of our transformations on a macro scale, CTEs can do this on a smaller scale inside our model files.

```sql
-- int_payments_pivoted_to_orders.sql

{%- set payment_methods = ['bank_transfer','credit_card','coupon','gift_card'] -%}

with

payments as (

   select * from {{ ref('stg_stripe__payments') }}

),

pivot_and_aggregate_payments_to_order_grain as (

   select
      order_id,
      {% for payment_method in payment_methods -%}

         sum(
            case
               when payment_method = '{{ payment_method }}' and
                    status = 'success'
               then amount
               else 0
            end
         ) as {{ payment_method }}_amount,

      {%- endfor %}
      sum(case when status = 'success' then amount end) as total_amount

   from payments

   group by 1

)

select * from pivot_and_aggregate_payments_to_order_grain
```

- ❌ **Exposed to end users.** Intermediate models should generally not be exposed in the main production schema. They are not intended for output to final targets like dashboards or applications, so it’s best to keep them separated from models that are so you can more easily control data governance and discoverability.
- ✅ **Materialized ephemerally.** Considering the above, one popular option is to default to intermediate models being materialized [ephemerally](/docs/build/materializations#ephemeral). This is generally the best place to start for simplicity. It will keep unnecessary models out of your warehouse with minimum configuration. Keep in mind though that the simplicity of ephemerals does translate a bit more difficulty in troubleshooting, as they’re interpolated into the models that `ref` them, rather than existing on their own in a way that you can view the output of.
- ✅ **Materialized as views in a custom schema with special permissions.** A more robust option is to materialize your intermediate models as views in a specific [custom schema](/docs/build/custom-schemas), outside of your main production schema. This gives you added insight into development and easier troubleshooting as the number and complexity of your models grows, while remaining easy to implement and taking up negligible space.

:::tip Keep your warehouse tidy!
There are three interfaces to the organizational knowledge graph we’re encoding into dbt: the DAG, the files and folder structure of our codebase, and the output into the warehouse. As such, it’s really important that we consider that output intentionally! Think of the schemas, tables, and views we’re creating in the warehouse as _part of the UX,_ in addition to the dashboards, ML, apps, and other use cases you may be targeting for the data. Ensuring that our output is named and grouped well, and that models not intended for broad use are either not materialized or built into special areas with specific permissions is crucial to achieving this.
:::

- Intermediate models’ purposes, as these serve to break up complexity from our marts models, can take as many forms as [data transformation](https://www.getdbt.com/analytics-engineering/transformation/) might require. Some of the most common use cases of intermediate models include:

  - ✅ **Structural simplification.** Bringing together a reasonable number (typically 4 to 6) of entities or concepts (staging models, or perhaps other intermediate models) that will be joined with another similarly purposed intermediate model to generate a mart — rather than have 10 joins in our mart, we can join two intermediate models that each house a piece of the complexity, giving us increased readability, flexibility, testing surface area, and insight into our components.
  - ✅ **Re-graining.** Intermediate models are often used to fan out or collapse models to the right composite grain — if we’re building a mart for `order_items` that requires us to fan out our `orders` based on the `quantity` column, creating a new single row for each item, this would be ideal to do in a specific intermediate model to maintain clarity in our mart and more easily view that our grain is correct before we mix it with other components.
  - ✅ **Isolating complex operations.** It’s helpful to move any particularly complex or difficult to understand pieces of logic into their own intermediate models. This not only makes them easier to refine and troubleshoot, but simplifies later models that can reference this concept in a more clearly readable way. For example, in the `quantity` fan out example above, we benefit by isolating this complex piece of logic so we can quickly debug and thoroughly test that transformation, and downstream models can reference `order_items` in a way that’s intuitively easy to grasp.

:::tip Narrow the DAG, widen the tables.
Until we get to the marts layer and start building our various outputs, we ideally want our DAG to look like an arrowhead pointed right. As we move from source-conformed to business-conformed, we’re also moving from numerous, narrow, isolated concepts to fewer, wider, joined concepts. We’re bringing our components together into wider, richer concepts, and that creates this shape in our DAG. This way when we get to the marts layer we have a robust set of components that can quickly and easily be put into any configuration to answer a variety of questions and serve specific needs. One rule of thumb to ensure you’re following this pattern on an individual model level is allowing multiple _inputs_ to a model, but **not** multiple _outputs_. Several arrows going _into_ our post-staging models is great and expected, several arrows coming _out_ is a red flag. There are absolutely situations where you need to break this rule, but it’s something to be aware of, careful about, and avoid when possible.
:::

:::info
Our guidance here diverges if you use the dbt Semantic Layer. In a project without the Semantic Layer we recommend you denormalize heavily, per the best practices below. On the other hand, if you're using the Semantic Layer, we want to stay as normalized as possible to allow MetricFlow the most flexibility. Guidance for marts in a Semantic Layer context is on the next page.
:::

This is the layer where everything comes together and we start to arrange all of our atoms (staging models) and molecules (intermediate models) into full-fledged cells that have identity and purpose. We sometimes like to call this the _entity_ _layer_ or _concept layer_, to emphasize that all our marts are meant to represent a specific entity or concept at its unique grain. For instance, an order, a customer, a territory, a click event, a payment — each of these would be represented with a distinct mart, and each row would represent a discrete instance of these concepts. Unlike in a traditional Kimball star schema though, in modern data warehousing — where storage is cheap and compute is expensive — we’ll happily borrow and add any and all data from other concepts that are relevant to answering questions about the mart’s core entity. Building the same data in multiple places, as we do with `orders` in our `customers` mart example below, is more efficient in this paradigm than repeatedly rejoining these concepts (this is a basic definition of denormalization in this context). Let’s take a look at how we approach this first layer intended expressly for exposure to end users.

## Marts: Files and folders

The last layer of our core transformations is below, providing models for both `finance` and `marketing` departments.

```shell
models/marts
├── finance
│   ├── _finance__models.yml
│   ├── orders.sql
│   └── payments.sql
└── marketing
    ├── _marketing__models.yml
    └── customers.sql
```

✅ **Group by department or area of concern.** If you have fewer than 10 or so marts you may not have much need for subfolders, so as with the intermediate layer, don’t over-optimize too early. If you do find yourself needing to insert more structure and grouping though, use useful business concepts here. In our marts layer, we’re no longer worried about source-conformed data, so grouping by departments (marketing, finance, etc.) is the most common structure at this stage.

✅ **Name by entity.** Use plain English to name the file based on the concept that forms the grain of the mart’s `customers`, `orders`. Marts that don't include any time-based rollups (pure marts) should not have a time dimension (`orders_per_day`) here, typically best captured via metrics.


❌ **Build the same concept differently for different teams.** `finance_orders` and `marketing_orders` is typically considered an anti-pattern. There are, as always, exceptions — a common pattern we see is that, finance may have specific needs, for example reporting revenue to the government in a way that diverges from how the company as a whole measures revenue day-to-day. Just make sure that these are clearly designed and understandable as _separate_ concepts, not departmental views on the same concept: `tax_revenue` and `revenue` not `finance_revenue` and `marketing_revenue`.

### Marts: Models

Finally we’ll take a look at the best practices for models within the marts directory by examining two of our marts models. These are the business-conformed — that is, crafted to our vision and needs — entities we’ve been bringing these transformed components together to create.

```sql
-- orders.sql

with

orders as  (

    select * from {{ ref('stg_jaffle_shop__orders' )}}

),

order_payments as (

    select * from {{ ref('int_payments_pivoted_to_orders') }}

),

orders_and_order_payments_joined as (

    select
        orders.order_id,
        orders.customer_id,
        orders.order_date,
        coalesce(order_payments.total_amount, 0) as amount,
        coalesce(order_payments.gift_card_amount, 0) as gift_card_amount

    from orders

    left join order_payments on orders.order_id = order_payments.order_id

)

select * from orders_and_payments_joined
```

```sql
-- customers.sql

with

customers as (

    select * from {{ ref('stg_jaffle_shop__customers')}}

),

orders as (

    select * from {{ ref('orders')}}

),

customer_orders as (

    select
        customer_id,
        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders,
        sum(amount) as lifetime_value

    from orders

    group by 1

),

customers_and_customer_orders_joined as (

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders,
        customer_orders.lifetime_value

    from customers

    left join customer_orders on customers.customer_id = customer_orders.customer_id

)

select * from customers_and_customer_orders_joined
```

- ✅ **Materialized as tables or incremental models.** Once we reach the marts layer, it’s time to start building not just our logic into the warehouse, but the data itself. This gives end users much faster performance for these later models that are actually designed for their use, and saves us costs recomputing these entire chains of models every time somebody refreshes a dashboard or runs a regression in python. A good general rule of thumb regarding materialization is to always start with a view (as it takes up essentially no storage and always gives you up-to-date results), once that view takes too long to practically _query_, build it into a table, and finally once that table takes too long to _build_ and is slowing down your runs, [configure it as an incremental model](https://docs.getdbt.com/docs/build/incremental-models/). As always, start simple and only add complexity as necessary. The models with the most data and compute-intensive transformations should absolutely take advantage of dbt’s excellent incremental materialization options, but rushing to make all your marts models incremental by default will introduce superfluous difficulty. We recommend reading this [classic post from Tristan on the limits of incremental modeling](https://discourse.getdbt.com/t/on-the-limits-of-incrementality/303).
- ✅ **Wide and denormalized.** Unlike old school warehousing, in the modern data stack storage is cheap and it’s compute that is expensive and must be prioritized as such, packing these into very wide denormalized concepts that can provide everything somebody needs about a concept as a goal.
- ❌ **Too many joins in one mart.** One good rule of thumb when building dbt transformations is to avoid bringing together too many concepts in a single mart. What constitutes ‘too many’ can vary. If you need to bring 8 staging models together with nothing but simple joins, that might be fine. Conversely, if you have 4 concepts you’re weaving together with some complex and computationally heavy window functions, that could be too much. You need to weigh the number of models you’re joining against the complexity of the logic within the mart, and if it’s too much to read through and build a clear mental model of then look to modularize. While this isn’t a hard rule, if you’re bringing together more than 4 or 5 concepts to create your mart, you may benefit from adding some intermediate models for added clarity. Two intermediate models that bring together three concepts each, and a mart that brings together those two intermediate models, will typically result in a much more readable chain of logic than a single mart with six joins.
- ✅ **Build on separate marts thoughtfully.** While we strive to preserve a narrowing DAG up to the marts layer, once here things may start to get a little less strict. A common example is passing information between marts at different grains, as we saw above, where we bring our `orders` mart into our `customers` marts to aggregate critical order data into a `customer` grain. Now that we’re really ‘spending’ compute and storage by actually building the data in our outputs, it’s sensible to leverage previously built resources to speed up and save costs on outputs that require similar data, versus recomputing the same views and CTEs from scratch. The right approach here is heavily dependent on your unique DAG, models, and goals — it’s just important to note that using a mart in building another, later mart is okay, but requires careful consideration to avoid wasted resources or circular dependencies.

:::tip Marts are entity-grained.
The most important aspect of marts is that they contain all of the useful data about a _particular entity_ at a granular level. That doesn’t mean we don’t bring in lots of other entities and concepts, like tons of `user` data into our `orders` mart, we do! It just means that individual `orders` remain the core grain of our table. If we start grouping `users` and `orders` along a [date spine](https://github.com/dbt-labs/dbt-utils#date_spine-source), into something like `user_orders_per_day`, we’re moving past marts into _metrics_.
:::

### Marts: Other considerations

- **Troubleshoot via tables.** While stacking views and ephemeral models up until our marts — only building data into the warehouse at the end of a chain when we have the models we really want end users to work with — is ideal in production, it can present some difficulties in development. Particularly, certain errors may seem to be surfacing in our later models that actually stem from much earlier dependencies in our model chain (ancestor models in our DAG that are built before the model throws the errors). If you’re having trouble pinning down where or what a database error is telling you, it can be helpful to temporarily build a specific chain of models as tables so that the warehouse will throw the error where it’s actually occurring.

### The dbt Semantic Layer and marts

Our structural recommendations are impacted quite a bit by whether or not you’re using the dbt Semantic Layer. If you're using the Semantic Layer, we recommend a more normalized approach to your marts. If you're not using the Semantic Layer, we recommend a more denormalized approach that has become typical in dbt projects. For the full list of recommendations on structure, naming, and organization in the Semantic Layer, check out the [How we build our metrics](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) guide, particularly the [Refactoring an existing rollup](/best-practices/how-we-build-our-metrics/semantic-layer-8-refactor-a-rollup) section.

## Project structure review

So far we’ve focused on the `models` folder, the primary directory of our dbt project. Next, we’ll zoom out and look at how the rest of our project files and folders fit in with this structure, starting with how we approach YAML configuration files.

```shell
models
├── intermediate
│   └── finance
│       ├── _int_finance__models.yml
│       └── int_payments_pivoted_to_orders.sql
├── marts
│   ├── finance
│   │   ├── _finance__models.yml
│   │   ├── orders.sql
│   │   └── payments.sql
│   └── marketing
│       ├── _marketing__models.yml
│       └── customers.sql
├── staging
│   ├── jaffle_shop
│   │   ├── _jaffle_shop__docs.md
│   │   ├── _jaffle_shop__models.yml
│   │   ├── _jaffle_shop__sources.yml
│   │   ├── base
│   │   │   ├── base_jaffle_shop__customers.sql
│   │   │   └── base_jaffle_shop__deleted_customers.sql
│   │   ├── stg_jaffle_shop__customers.sql
│   │   └── stg_jaffle_shop__orders.sql
│   └── stripe
│       ├── _stripe__models.yml
│       ├── _stripe__sources.yml
│       └── stg_stripe__payments.sql
└── utilities
    └── all_dates.sql
```

### YAML in-depth

When structuring your YAML configuration files in a dbt project, you want to balance centralization and file size to make specific configs as easy to find as possible. It’s important to note that while the top-level YAML files (`dbt_project.yml`, `packages.yml`) need to be specifically named and in specific locations, the files containing your `sources` and `models` dictionaries can be named, located, and organized however you want. It’s the internal contents that matter here. As such, we’ll lay out our primary recommendation, as well as the pros and cons of a popular alternative. Like many other aspects of structuring your dbt project, what’s most important here is consistency, clear intention, and thorough documentation on how and why you do what you do.

- ✅ **Config per folder.** As in the example above, create a `_[directory]__models.yml` per directory in your models folder that configures all the models in that directory. for staging folders, also include a `_[directory]__sources.yml` per directory.
  - The leading underscore ensures your YAML files will be sorted to the top of every folder to make them easy to separate from your models.
  - YAML files don’t need unique names in the way that SQL model files do, but including the directory (instead of simply `_sources.yml` in each folder), means you can fuzzy find the right file more quickly.
  - We’ve recommended several different naming conventions over the years, most recently calling these `schema.yml` files. We’ve simplified to recommend that these simply be labelled based on the YAML dictionary that they contain.
  - If you utilize [doc blocks](https://docs.getdbt.com/docs/build/documentation#using-docs-blocks) in your project, we recommend following the same pattern, and creating a `_[directory]__docs.md` markdown file per directory containing all your doc blocks for that folder of models.
- ❌ **Config per project.** Some people put _all_ of their source and model YAML into one file. While you can technically do this, and while it certainly simplifies knowing what file the config you’re looking for will be in (as there is only one file), it makes it much harder to find specific configurations within that file. We recommend balancing those two concerns.
- ⚠️ **Config per model.** On the other end of the spectrum, some people prefer to create one YAML file per model. This presents less of an issue than a single monolith file, as you can quickly search for files, know exactly where specific configurations exist, spot models without configs (and thus without tests) by looking at the file tree, and various other advantages. In our opinion, the extra files, tabs, and windows this requires creating, copying from, pasting to, closing, opening, and managing creates a somewhat slower development experience that outweighs the benefits. Defining config per directory is the most balanced approach for most projects, but if you have compelling reasons to use config per model, there are definitely some great projects that follow this paradigm.
- ✅ **Cascade configs.** Leverage your `dbt_project.yml` to set default configurations at the directory level. Use the well-organized folder structure we’ve created thus far to define the baseline schemas and materializations, and use dbt’s cascading scope priority to define variations to this. For example, as below, define your marts to be materialized as tables by default, define separate schemas for our separate subfolders, and any models that need to use incremental materialization can be defined at the model level.

```yaml
-- dbt_project.yml

models:
  jaffle_shop:
    staging:
      +materialized: view
    intermediate:
      +materialized: ephemeral
    marts:
      +materialized: table
      finance:
        +schema: finance
      marketing:
        +schema: marketing
```

:::tip Define your defaults.
One of the many benefits this consistent approach to project structure confers to us is this ability to cascade default behavior. Carefully organizing our folders and defining configuration at that level whenever possible frees us from configuring things like schema and materialization in every single model (not very DRY!) — we only need to configure exceptions to our general rules. Tagging is another area this principle comes into play. Many people new to dbt will rely on tags rather than a rigorous folder structure, and quickly find themselves in a place where every model _requires_ a tag. This creates unnecessary complexity. We want to lean on our folders as our primary selectors and grouping mechanism, and use tags to define groups that are _exceptions._ A folder-based selection like \*\*`dbt build --select marts.marketing` is much simpler than trying to tag every marketing-related model, hoping all developers remember to add that tag for new models, and using `dbt build --select tag:marketing`.
:::

### How we use the other folders

```shell
jaffle_shop
├── analyses
├── seeds
│   └── employees.csv
├── macros
│   ├── _macros.yml
│   └── cents_to_dollars.sql
├── snapshots
└── tests
└── assert_positive_value_for_total_amount.sql
```

We’ve focused heavily thus far on the primary area of action in our dbt project, the `models` folder. As you’ve probably observed though, there are several other folders in our project. While these are, by design, very flexible to your needs, we’ll discuss the most common use cases for these other folders to help get you started.

- ✅ `seeds` for lookup tables. The most common use case for seeds is loading lookup tables that are helpful for modeling but don’t exist in any source systems — think mapping zip codes to states, or UTM parameters to marketing campaigns. In this example project we have a small seed that maps our employees to their `customer_id`s, so that we can handle their purchases with special logic.
- ❌ `seeds` for loading source data. Do not use seeds to load data from a source system into your warehouse. If it exists in a system you have access to, you should be loading it with a proper EL tool into the raw data area of your warehouse. dbt is designed to operate on data in the warehouse, not as a data-loading tool.
- ✅ `analyses` for storing auditing queries. The `analyses` folder lets you store any queries you want to use Jinja with and version control, but not build into models in your warehouse. There are limitless possibilities here, but the most common use case when we set up projects at dbt Labs is to keep queries that leverage the [audit helper](https://github.com/dbt-labs/dbt-audit-helper) package. This package is incredibly useful for finding discrepancies in output when migrating logic from another system into dbt.
- ✅ `tests` for testing multiple specific tables simultaneously. As dbt tests have evolved, writing singular tests has become less and less necessary. It's extremely useful for work-shopping test logic, but more often than not you'll find yourself either migrating that logic into your own custom generic tests or discovering a pre-built test that meets your needs from the ever-expanding universe of dbt packages (between the extra tests in [`dbt-utils`](https://github.com/dbt-labs/dbt-utils) and [`dbt-expectations`](https://github.com/calogica/dbt-expectations) almost any situation is covered). One area where singular tests still shine though is flexibly testing things that require a variety of specific models. If you're familiar with the difference between [unit tests](https://en.wikipedia.org/wiki/Unit_testing) [and](https://www.testim.io/blog/unit-test-vs-integration-test/) [integration](https://www.codecademy.com/resources/blog/what-is-integration-testing/) [tests](https://en.wikipedia.org/wiki/Integration_testing) in software engineering, you can think of generic and singular tests in a similar way. If you need to test the results of how several specific models interact or relate to each other, a singular test will likely be the quickest way to nail down your logic.
- ✅ `snapshots` for creating [Type 2 slowly changing dimension](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row) records from [Type 1](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_1:_overwrite) (destructively updated) source data. This is [covered thoroughly in the dbt Docs](/docs/build/snapshots), unlike these other folders has a more defined purpose, and is out-of-scope for this guide, but mentioned for completion.
- ✅ `macros` for DRY-ing up transformations you find yourself doing repeatedly. Like snapshots, a full dive into macros is out-of-scope for this guide and well [covered elsewhere](/docs/build/jinja-macros), but one important structure-related recommendation is to [write documentation for your macros](https://docs.getdbt.com/faqs/docs/documenting-macros). We recommend creating a `_macros.yml` and documenting the purpose and arguments for your macros once they’re ready for use.

### Project splitting

One important, growing consideration in the analytics engineering ecosystem is how and when to split a codebase into multiple dbt projects. Currently, our advice for most teams, especially those just starting, is fairly simple: in most cases, we recommend doing so with [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro)! dbt Mesh allows organizations to handle complexity by connecting several dbt projects rather than relying on one big, monolithic project. This approach is designed to speed up development while maintaining governance. 

As breaking up monolithic dbt projects into smaller, connected projects, potentially within a modern mono repo becomes easier, the scenarios we currently advise against may soon become feasible. So watch this space!

- ✅ **Business groups or departments.** Conceptual separations within the project are the primary reason to split up your project. This allows your business domains to own their own data products and still collaborate using dbt Mesh. For more information about dbt Mesh, please refer to our [dbt Mesh FAQs](/best-practices/how-we-mesh/mesh-5-faqs).
- ✅ **Data governance.** Structural, organizational needs — such as data governance and security — are one of the few worthwhile reasons to split up a project. If, for instance, you work at a healthcare company with only a small team cleared to access raw data with PII in it, you may need to split out your staging models into their own projects to preserve those policies. In that case, you would import your staging project into the project that builds on those staging models as a [private package](https://docs.getdbt.com/docs/build/packages/#private-packages).
- ✅ **Project size.** At a certain point, your project may grow to have simply too many models to present a viable development experience. If you have 1000s of models, it absolutely makes sense to find a way to split up your project.
- ❌ **ML vs Reporting use cases.** Similarly to the point above, splitting a project up based on different use cases, particularly more standard BI versus ML features, is a common idea. We tend to discourage it for the time being. As with the previous point, a foundational goal of implementing dbt is to create a single source of truth in your organization. The features you’re providing to your data science teams should be coming from the same marts and metrics that serve reports on executive dashboards.

## Final considerations

Overall, consistency is more important than any of these specific conventions. As your project grows and your experience with dbt deepens, you will undoubtedly find aspects of the above structure you want to change. While we recommend this approach for the majority of projects, every organization is unique! The only dogmatic advice we’ll put forward here is that when you find aspects of the above structure you wish to change, think intently about your reasoning and document for your team _how_ and _why_ you are deviating from these conventions. To that end, we highly encourage you to fork this guide and add it to your project’s README, wiki, or docs so you can quickly create and customize those artifacts.

Finally, we emphasize that this guide is a living document! It will certainly change and grow as dbt and dbt Labs evolve. We invite you to join in — discuss, comment, and contribute regarding suggested changes or new elements to cover.
