-- ============================================
-- PRM: Clean Remove User Script
-- ============================================
-- Run in Supabase SQL Editor.
-- Just change the email on line 8, then run.
-- ============================================

DO $$
DECLARE
  v_email TEXT := 'PUT_EMAIL_HERE';  -- ← CHANGE THIS
  v_user_id UUID;
  v_name TEXT;
  v_del INT;
BEGIN
  -- Find the user
  SELECT id INTO v_user_id FROM auth.users WHERE email = LOWER(v_email);

  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ No auth user found for: %', v_email;
    RAISE NOTICE '   Cleaning orphan records by email anyway...';
  ELSE
    SELECT display_name INTO v_name FROM user_profiles WHERE user_id = v_user_id;
    RAISE NOTICE '✅ Found: % (%)', COALESCE(v_name, '?'), v_user_id;
  END IF;

  -- Notifications (sent or received)
  IF v_user_id IS NOT NULL THEN
    DELETE FROM notifications WHERE sender_id = v_user_id OR recipient_id = v_user_id;
    GET DIAGNOSTICS v_del = ROW_COUNT;
    RAISE NOTICE '   Notifications deleted: %', v_del;
  END IF;
  DELETE FROM notifications WHERE sender_email = LOWER(v_email);

  -- Invitations (sent or received)
  IF v_user_id IS NOT NULL THEN
    DELETE FROM invitations WHERE inviter_id = v_user_id;
  END IF;
  DELETE FROM invitations WHERE invitee_email = LOWER(v_email);
  GET DIAGNOSTICS v_del = ROW_COUNT;
  RAISE NOTICE '   Invitations deleted: %', v_del;

  -- Contacts
  IF v_user_id IS NOT NULL THEN
    DELETE FROM contacts WHERE user_id = v_user_id;
    GET DIAGNOSTICS v_del = ROW_COUNT;
    RAISE NOTICE '   Contacts deleted: %', v_del;
  END IF;

  -- User profile
  IF v_user_id IS NOT NULL THEN
    DELETE FROM user_profiles WHERE user_id = v_user_id;
    RAISE NOTICE '   User profile deleted';
  END IF;

  -- Auth user (last)
  IF v_user_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = v_user_id;
    RAISE NOTICE '   Auth record deleted';
  END IF;

  RAISE NOTICE '🧹 Done — % fully removed.', v_email;
END $$;
