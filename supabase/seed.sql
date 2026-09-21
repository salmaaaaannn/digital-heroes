-- SEED DATA for Digital Heroes

-- 1. Charities
INSERT INTO public.charities (id, name, slug, description, category, featured, active) VALUES
('b2a543b5-3d84-48f8-b3d5-e51f5c6c06b2', 'Global Clean Water Initiative', 'clean-water-init', 'Providing sustainable access to safe drinking water in developing nations.', 'Healthcare', true, true),
('70d10a62-9e8d-4f11-9a74-128a1c8f1f7d', 'Future Builders Education', 'future-builders', 'Building schools and providing digital access to education globally.', 'Education', true, true),
('d96e5793-27cc-44a6-84d4-28b3e8c97194', 'Ocean Renewal Project', 'ocean-renewal', 'Cleaning oceans and protecting marine wildlife from plastic pollution.', 'Environment', true, true),
('34a87c10-e221-4f16-8367-93e1b7b7f164', 'Local Community Kitchens', 'community-kitchens', 'Fighting local hunger and food insecurity with community-driven kitchens.', 'Community', false, true),
('8d8b9d62-1a41-4775-816b-74dbb839f4f3', 'Children''s Health Fund', 'childrens-health', 'Funding essential medical procedures and research for rare children''s diseases.', 'Children', false, true),
('f6b15804-032a-4467-85b4-d538622c7eb1', 'Tech for Good Foundation', 'tech-for-good', 'Using software and hardware innovation to solve global challenges.', 'Other', false, true)
ON CONFLICT (id) DO NOTHING;

-- Demo Users would require setting up auth.users first, which is best done via the app or Supabase studio due to password hashing. 
