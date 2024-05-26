alter table "public"."profiles" drop column "flash_screen_completed";

alter table "public"."profiles" add column "onboarding_completed" boolean;