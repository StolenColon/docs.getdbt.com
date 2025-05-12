
  
    

    create or replace table `organic-bivouac-458413-s3`.`jaffle_shop`.`stg_orders`
      
    
    

    OPTIONS()
    as (
      select
    id as order_id,
    user_id as customer_id,
    order_date,
    status

from `dbt-tutorial`.jaffle_shop.orders
    );
  