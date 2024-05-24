alter table "public"."profiles" drop constraint "public_profiles_cultureRef_fkey";

alter table "public"."referrals" drop constraint "referrals_pkey";

drop index if exists "public"."referrals_pkey";

alter table "public"."profiles" drop column "cultureRef";

alter table "public"."profiles" add column "culture_ref" text;

alter table "public"."profiles" add column "flash_screen_completed" boolean;

alter table "public"."referrals" drop column "cultureRef";

alter table "public"."referrals" add column "culture_ref" text not null;

CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree (culture_ref);

alter table "public"."referrals" add constraint "referrals_pkey" PRIMARY KEY using index "referrals_pkey";

alter table "public"."profiles" add constraint "public_profiles_culture_ref_fkey" FOREIGN KEY (culture_ref) REFERENCES referrals(culture_ref) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."profiles" validate constraint "public_profiles_culture_ref_fkey";
