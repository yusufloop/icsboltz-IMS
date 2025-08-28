-- Insert default roles if they don't exist
INSERT INTO public.roles (role_name) 
SELECT unnest(ARRAY['ADMINISTRATOR', 'GENERAL_MANAGER', 'HEAD_OF_DEPARTMENT', 'REQUESTER']) 
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE role_name = 'ADMINISTRATOR');

-- Example: Assign ADMINISTRATOR role to a user (replace with actual user ID)
-- INSERT INTO public.user_roles (user_id, role_id) 
-- SELECT 'user-uuid-here', role_id 
-- FROM public.roles 
-- WHERE role_name = 'ADMINISTRATOR';