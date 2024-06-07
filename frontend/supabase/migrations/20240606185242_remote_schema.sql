create type "public"."transaction_type" as enum ('buy', 'sell');

alter table "public"."transactions" drop column "date_purchased";

alter table "public"."transactions" drop column "date_sold";

alter table "public"."transactions" add column "image_url" text;

alter table "public"."transactions" add column "token_address" text;

alter table "public"."transactions" add column "transaction_type" transaction_type;

alter table "public"."transactions" add column "wallet_address" text;
