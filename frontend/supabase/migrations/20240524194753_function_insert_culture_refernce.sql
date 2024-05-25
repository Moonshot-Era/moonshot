set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_culture_ref(culture_ref text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_id uuid;
    existing_culture_ref text;
BEGIN
    -- Get the current user ID from the JWT
    SELECT auth.uid() INTO user_id;
    
    -- Check if the provided culture_ref exists in the referrals table
    IF NOT EXISTS (SELECT 1 FROM public.referrals WHERE culture_ref = $1) THEN
        RAISE EXCEPTION 'Culture reference % does not exist in referrals', $1;
    END IF;

    -- Check if the current user's profile has an existing culture_ref
    SELECT p.culture_ref INTO existing_culture_ref 
    FROM public.profiles p 
    WHERE p.user_id = user_id;

    -- If the culture_ref is not set, update it with the provided culture_ref
    IF existing_culture_ref IS NULL THEN
        UPDATE public.profiles
        SET culture_ref = $1
        WHERE user_id = user_id;
    END IF;

    -- If culture_ref already exists, do nothing and return
    RETURN;
END;
$function$
;