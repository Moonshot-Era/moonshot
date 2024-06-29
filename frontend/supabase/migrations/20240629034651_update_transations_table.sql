alter type "public"."transaction_type" rename to "transaction_type__old_version_to_be_dropped";

create type "public"."transaction_type" as enum ('buy', 'sell', 'convert', 'withdraw');

alter table "public"."transactions" alter column transaction_type type "public"."transaction_type" using transaction_type::text::"public"."transaction_type";

drop type "public"."transaction_type__old_version_to_be_dropped";

alter table "public"."transactions" add column "to_wallet_address" text;

alter table "public"."transactions" add column "token_image_url" text;

alter table "public"."transactions" add column "token_output_address" text;

alter table "public"."transactions" add column "token_output_amount" numeric;

alter table "public"."transactions" add column "token_output_image_url" text;

alter table "public"."transactions" add column "token_output_name" text;

alter table "public"."transactions" add column "token_output_price" numeric;

alter table "public"."transactions" add column "token_output_symbol" text;

alter table "public"."transactions" add column "token_symbol" text;

alter table "public"."transactions" add column "tx_hash" text;

alter table "public"."transactions" alter column "token_amount" set data type numeric using "token_amount"::numeric;

alter table "public"."transactions" alter column "token_price" set data type numeric using "token_price"::numeric;