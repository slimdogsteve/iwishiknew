-- Run in Supabase SQL Editor
-- This function searches through a platform user's contacts for skill matches
-- Used for 2nd degree "search my connection's connections" 

CREATE OR REPLACE FUNCTION search_contacts_of_user(
  owner_user_id UUID,
  search_terms TEXT[]
)
RETURNS TABLE(
  contact_name TEXT,
  contact_skills JSONB,
  matched_skills TEXT[]
) AS $$
DECLARE
  contact_row RECORD;
  contact_item JSONB;
  skills_arr TEXT[];
  matched TEXT[];
  skill TEXT;
  term TEXT;
BEGIN
  -- Get the user's contacts JSON
  SELECT contact_data INTO contact_row FROM contacts WHERE user_id = owner_user_id;
  IF contact_row.contact_data IS NULL THEN RETURN; END IF;

  -- Loop through each contact in their list
  FOR contact_item IN SELECT * FROM jsonb_array_elements(contact_row.contact_data)
  LOOP
    -- Gather all skills from enhanced.expertise, inferred.skills, emailInsights.expertiseSignals
    skills_arr := ARRAY[]::TEXT[];
    
    IF contact_item->'enhanced'->'expertise' IS NOT NULL THEN
      SELECT array_agg(elem::TEXT) INTO skills_arr
      FROM jsonb_array_elements_text(contact_item->'enhanced'->'expertise') elem;
    END IF;
    
    IF contact_item->'inferred'->'skills' IS NOT NULL THEN
      skills_arr := skills_arr || COALESCE(
        (SELECT array_agg(elem::TEXT) FROM jsonb_array_elements_text(contact_item->'inferred'->'skills') elem),
        ARRAY[]::TEXT[]
      );
    END IF;
    
    IF contact_item->'emailInsights'->'expertiseSignals' IS NOT NULL THEN
      skills_arr := skills_arr || COALESCE(
        (SELECT array_agg(elem::TEXT) FROM jsonb_array_elements_text(contact_item->'emailInsights'->'expertiseSignals') elem),
        ARRAY[]::TEXT[]
      );
    END IF;

    -- Also check position and company as pseudo-skills
    IF contact_item->>'position' IS NOT NULL AND contact_item->>'position' != '' THEN
      skills_arr := skills_arr || ARRAY[contact_item->>'position'];
    END IF;

    IF array_length(skills_arr, 1) IS NULL OR array_length(skills_arr, 1) = 0 THEN
      CONTINUE;
    END IF;

    -- Check each skill against search terms (word-level fuzzy match)
    matched := ARRAY[]::TEXT[];
    FOREACH skill IN ARRAY skills_arr
    LOOP
      FOREACH term IN ARRAY search_terms
      LOOP
        IF LOWER(skill) LIKE '%' || LOWER(term) || '%' OR LOWER(term) LIKE '%' || LOWER(skill) || '%' THEN
          matched := matched || ARRAY[skill];
          EXIT; -- don't double-count same skill
        END IF;
      END LOOP;
    END LOOP;

    IF array_length(matched, 1) > 0 THEN
      contact_name := contact_item->>'name';
      contact_skills := to_jsonb(skills_arr);
      matched_skills := matched;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
