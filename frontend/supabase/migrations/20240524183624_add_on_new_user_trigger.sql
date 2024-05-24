drop trigger if exists "on_new_user_created" on "auth"."users";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION auth.create_new_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.profiles (user_id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;$function$
;

CREATE TRIGGER on_new_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.create_new_profile();