create table "public"."sessions" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "session_data" bytea,
    "mfa_s" bytea
);


alter table "public"."sessions" enable row level security;

CREATE UNIQUE INDEX session_pkey ON public.sessions USING btree (user_id);

alter table "public"."sessions" add constraint "session_pkey" PRIMARY KEY using index "session_pkey";

alter table "public"."sessions" add constraint "public_session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "public_session_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_session_data()
 RETURNS TABLE(session_data text, mfa_s text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  encrypted_session_data bytea;
  encrypted_mfa_secret bytea;
  decrypted_session_data TEXT;
  decrypted_mfa_secret TEXT;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  IF encryption_key IS NULL THEN
    RETURN QUERY SELECT null, null;
  END IF;

  SELECT session_data, mfa_s INTO encrypted_session_data, encrypted_mfa_secret FROM sessions WHERE sessions.user_id = current_user_id;

  IF encrypted_session_data IS NULL OR encrypted_mfa_secret IS NULL THEN
    RETURN QUERY SELECT null, null;
  END IF;

  decrypted_session_data := pgp_sym_decrypt(encrypted_session_data, encryption_key);
  decrypted_mfa_secret := pgp_sym_decrypt(encrypted_mfa_secret, encryption_key);

  RETURN QUERY SELECT decrypted_session_data, decrypted_mfa_secret;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.store_session_data(session_data text, mfa_s text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  encrypted_session_data bytea;
  encrypted_mfa_secret bytea;
  encryption_key TEXT;
BEGIN
  SELECT auth.uid() INTO current_user_id;

  IF current_user_id IS NULL THEN
     RAISE EXCEPTION 'User not found';
  END IF;
 
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE key_id = '94b538de-47d6-4116-9f6a-9b1cfbdce5c0';

  encrypted_session_data := pgp_sym_encrypt(session_data, encryption_key);
  encrypted_mfa_secret := pgp_sym_encrypt(mfa_s, encryption_key);

  INSERT INTO sessions (user_id, session_data, mfa_s)
        VALUES (current_user_id, encrypted_session_data, encrypted_mfa_secret)
                ON CONFLICT (user_id) DO UPDATE
                        SET session_data = EXCLUDED.session_data,
                        mfa_s = EXCLUDED.mfa_s;
END;
$function$
;

grant delete on table "public"."sessions" to "authenticated";

grant insert on table "public"."sessions" to "authenticated";

grant references on table "public"."sessions" to "authenticated";

grant select on table "public"."sessions" to "authenticated";

grant trigger on table "public"."sessions" to "authenticated";

grant truncate on table "public"."sessions" to "authenticated";

grant update on table "public"."sessions" to "authenticated";

grant delete on table "public"."sessions" to "service_role";

grant insert on table "public"."sessions" to "service_role";

grant references on table "public"."sessions" to "service_role";

grant select on table "public"."sessions" to "service_role";

grant trigger on table "public"."sessions" to "service_role";

grant truncate on table "public"."sessions" to "service_role";

grant update on table "public"."sessions" to "service_role";

create policy "Enable CRUD for users based on user_id"
on "public"."sessions"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
