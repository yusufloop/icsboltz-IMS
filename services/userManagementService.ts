import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface UserWithRoles {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
  email_confirmed_at?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  roles: {
    role_id: number;
    role_name: string;
  }[];
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role_ids: number[];
}

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  role_ids?: number[];
}

export class UserManagementService {
  // Get all users with their roles (Admin only)
  static async getAllUsers(): Promise<{ data: UserWithRoles[] | null; error: string | null }> {
    try {
      // First get all users from auth.users
      console.log('Fetching users from auth.admin.listUsers()...');
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      console.log('Users from auth:', users?.length || 0, 'users');
      console.log('Users error:', usersError);
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        return { data: null, error: usersError.message };
      }

      // Get all user roles
      console.log('Fetching user roles...');
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role:roles (
            role_id,
            role_name
          )
        `);

      console.log('User roles:', userRoles?.length || 0, 'role assignments');
      console.log('Roles error:', rolesError);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return { data: null, error: rolesError.message };
      }

      // Combine user data with roles
      console.log('Combining user data with roles...');
      const usersWithRoles: UserWithRoles[] = users.map(user => {
        const userRoleData = userRoles?.filter(ur => ur.user_id === user.id) || [];
        console.log(`User ${user.email}: ${userRoleData.length} roles`);
        return {
          id: user.id,
          email: user.email || '',
          user_metadata: user.user_metadata,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_sign_in_at: user.last_sign_in_at,
          roles: userRoleData.map(ur => ({
            role_id: ur.role.role_id,
            role_name: ur.role.role_name
          }))
        };
      });

      console.log('Final result: ', usersWithRoles.length, 'users with roles');
      return { data: usersWithRoles, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Get all available roles
  static async getAllRoles(): Promise<{ data: Array<{ role_id: number; role_name: string }> | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('role_id, role_name')
        .order('role_name');

      return { data, error: error?.message || null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Create a new user (Admin only)
  static async createUser(userData: CreateUserData): Promise<{ data: User | null; error: string | null }> {
    try {
      // Create user with Supabase Auth Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
          full_name: userData.full_name
        },
        email_confirm: true // Auto-confirm email for admin-created users
      });

      if (authError) {
        return { data: null, error: authError.message };
      }

      if (!authData.user) {
        return { data: null, error: 'Failed to create user' };
      }

      // Assign roles to the new user
      if (userData.role_ids.length > 0) {
        const roleInserts = userData.role_ids.map(role_id => ({
          user_id: authData.user.id,
          role_id
        }));

        const { error: roleError } = await supabase
          .from('user_roles')
          .insert(roleInserts);

        if (roleError) {
          // If role assignment fails, we should consider deleting the user or at least log it
          console.error('Error assigning roles to new user:', roleError);
        }
      }

      return { data: authData.user, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Update user (Admin only)
  static async updateUser(userId: string, updateData: UpdateUserData): Promise<{ data: User | null; error: string | null }> {
    try {
      const updates: any = {};

      if (updateData.email) {
        updates.email = updateData.email;
      }

      if (updateData.full_name) {
        updates.user_metadata = { full_name: updateData.full_name };
      }

      // Update user basic info if needed
      if (Object.keys(updates).length > 0) {
        const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
          userId,
          updates
        );

        if (authError) {
          return { data: null, error: authError.message };
        }
      }

      // Update user roles if provided
      if (updateData.role_ids !== undefined) {
        // First, remove all existing roles
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          return { data: null, error: deleteError.message };
        }

        // Then add new roles
        if (updateData.role_ids.length > 0) {
          const roleInserts = updateData.role_ids.map(role_id => ({
            user_id: userId,
            role_id
          }));

          const { error: insertError } = await supabase
            .from('user_roles')
            .insert(roleInserts);

          if (insertError) {
            return { data: null, error: insertError.message };
          }
        }
      }

      // Get updated user data
      const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserById(userId);
      
      if (getUserError) {
        return { data: null, error: getUserError.message };
      }

      return { data: user, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Delete user (Admin only)
  static async deleteUser(userId: string): Promise<{ error: string | null }> {
    try {
      // First remove user roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) {
        return { error: roleError.message };
      }

      // Then delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        return { error: authError.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Check if current user is admin
  static async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select(`
          role:roles (
            role_name
          )
        `)
        .eq('user_id', user.id);

      if (error || !userRoles) return false;

      return userRoles.some(ur => ur.role?.role_name === 'ADMINISTRATOR');
    } catch {
      return false;
    }
  }
}