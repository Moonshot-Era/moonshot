alter table "public"."transactions" drop constraint "transactions_user_id_fkey";

alter table "public"."transactions" alter column "user_id" set data type uuid using "user_id"::uuid;


