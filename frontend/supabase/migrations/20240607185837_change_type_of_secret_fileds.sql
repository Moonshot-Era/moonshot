alter table "public"."profiles" alter column "mfa_s" set data type bytea using "mfa_s"::bytea;

alter table "public"."profiles" alter column "rt" set data type bytea using "rt"::bytea;