INSERT INTO public.site_settings (key, value, is_public)
VALUES (
  'public_contact',
  '{
    "email": "info@cartscout.co.za",
    "phone": "+27839435908",
    "phone_display": "+27 83 943 5908",
    "address": [
      "135 Rivonia Road",
      "Sandton (Sandown / Central Sandton)",
      "City of Johannesburg Metropolitan Municipality",
      "Gauteng",
      "2196",
      "South Africa"
    ]
  }'::jsonb,
  true
)
ON CONFLICT (key) DO NOTHING;
