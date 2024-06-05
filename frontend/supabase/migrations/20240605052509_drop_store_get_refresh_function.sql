drop function if exists "public"."get_refresh_token"(user_id uuid);

drop function if exists "public"."store_refresh_token"(user_id uuid, refresh_token text);