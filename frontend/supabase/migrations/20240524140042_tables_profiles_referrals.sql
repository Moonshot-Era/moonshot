create table "public"."referrals" (
    "cultureRef" text not null,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."profiles" add column "cultureRef" text;

alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree ("cultureRef");

alter table "public"."referrals" add constraint "referrals_pkey" PRIMARY KEY using index "referrals_pkey";

alter table "public"."profiles" add constraint "public_profiles_cultureRef_fkey" FOREIGN KEY ("cultureRef") REFERENCES referrals("cultureRef") ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."profiles" validate constraint "public_profiles_cultureRef_fkey";

grant delete on table "public"."referrals" to "anon";

grant insert on table "public"."referrals" to "anon";

grant references on table "public"."referrals" to "anon";

grant select on table "public"."referrals" to "anon";

grant trigger on table "public"."referrals" to "anon";

grant truncate on table "public"."referrals" to "anon";

grant update on table "public"."referrals" to "anon";

grant delete on table "public"."referrals" to "authenticated";

grant insert on table "public"."referrals" to "authenticated";

grant references on table "public"."referrals" to "authenticated";

grant select on table "public"."referrals" to "authenticated";

grant trigger on table "public"."referrals" to "authenticated";

grant truncate on table "public"."referrals" to "authenticated";

grant update on table "public"."referrals" to "authenticated";

grant delete on table "public"."referrals" to "service_role";

grant insert on table "public"."referrals" to "service_role";

grant references on table "public"."referrals" to "service_role";

grant select on table "public"."referrals" to "service_role";

grant trigger on table "public"."referrals" to "service_role";

grant truncate on table "public"."referrals" to "service_role";

grant update on table "public"."referrals" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."profiles"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on userID"
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."referrals"
as permissive
for select
to public
using (true);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION auth.create_new_profile()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  insert into public.profiles (user_id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;$function$
;

CREATE TRIGGER on_new_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.create_new_profile();