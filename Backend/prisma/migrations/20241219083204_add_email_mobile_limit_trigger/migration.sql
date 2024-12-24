-- Step 1: Drop unique indexes for email and mobile
DROP INDEX IF EXISTS "User_email_key";
DROP INDEX IF EXISTS "User_mobile_key";

-- Step 2: Create the function to enforce the 3-account limit
CREATE OR REPLACE FUNCTION check_email_mobile_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check email limit
  IF (SELECT COUNT(*) FROM "User" WHERE email = NEW.email) >= 3 THEN
    RAISE EXCEPTION 'Email is already linked to 3 accounts.';
  END IF;

  -- Check mobile limit
  IF (SELECT COUNT(*) FROM "User" WHERE mobile = NEW.mobile) >= 3 THEN
    RAISE EXCEPTION 'Mobile number is already linked to 3 accounts.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Attach the trigger to the User table
CREATE TRIGGER limit_email_mobile_trigger
BEFORE INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION check_email_mobile_limit();
