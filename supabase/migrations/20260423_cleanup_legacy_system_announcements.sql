-- Cleanup duplicate legacy system announcements from portal_state JSON payload
update public.portal_state
set data = jsonb_set(
  data,
  '{psa_announcements}',
  coalesce(
    (
      select jsonb_agg(elem)
      from jsonb_array_elements(coalesce(data->'psa_announcements', '[]'::jsonb)) elem
      where coalesce(lower(elem->>'sourceType'), 'announcement') <> 'system'
        and not (
          coalesce(elem->>'message', '') ~* '^(ticket (submitted|updated|deleted)|schedule (added|updated|deleted)|accomplishment report submitted|attendance \||time-in:|time-out:)'
        )
    ),
    '[]'::jsonb
  ),
  true
)
where id = 1;
