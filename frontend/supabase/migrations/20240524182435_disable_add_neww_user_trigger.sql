drop trigger if exists "on_new_user_created" on "auth"."users";

CREATE TRIGGER on_new_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.create_new_profile();
ALTER TABLE "auth"."users" DISABLE TRIGGER "on_new_user_created";