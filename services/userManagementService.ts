import { supabase, supabaseAdmin } from '@/lib/supabase';
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
      // Check if current user is admin first
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { data: null, error: 'Access denied: Admin privileges required' };
      }

      console.log('Fetching all users with service role...');
      
      // Use service role client to get all users from auth.users
      const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        return { data: null, error: usersError.message };
      }

      // Get all user roles using service role client
      const { data: userRolesData, error: rolesError } = await supabaseAdmin
        .from('user_roles')
        .select(`
          user_id,
          role:roles (
            role_id,
            role_name
          )
        `);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return { data: null, error: rolesError.message };
      }

      // Map users with their roles
      const usersWithRoles: UserWithRoles[] = users.map(user => {
        const userRoles = userRolesData?.filter(ur => ur.user_id === user.id) || [];
        
        return {
          id: user.id,
          email: user.email || '',
          user_metadata: user.user_metadata,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_sign_in_at: user.last_sign_in_at,
          roles: userRoles.map(ur => ({
            role_id: ur.role.role_id,
            role_name: ur.role.role_name
          }))
        };
      });

      console.log('Final result:', usersWithRoles.length, 'users with roles');
      return { data: usersWithRoles, error: null };
    } catch (error: any) {
      console.error('Error in getAllUsers:', error);
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
      // Check if current user is admin first
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { data: null, error: 'Access denied: Admin privileges required' };
      }

      // Create user using service role
      const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: { full_name: userData.full_name },
        email_confirm: true
      });

      if (createError) {
        return { data: null, error: createError.message };
      }

      const newUser = data.user;

      // Add roles to the new user
      if (userData.role_ids.length > 0) {
        const roleInserts = userData.role_ids.map(role_id => ({
          user_id: newUser.id,
          role_id
        }));

        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert(roleInserts);

        if (roleError) {
          // If role assignment fails, we should consider whether to delete the user
          console.error('Failed to assign roles to new user:', roleError);
          return { data: null, error: `User created but role assignment failed: ${roleError.message}` };
        }
      }

      return { data: newUser, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Update user (Admin only)
  static async updateUser(userId: string, updateData: UpdateUserData): Promise<{ data: User | null; error: string | null }> {
    try {
      // Check if current user is admin first
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { data: null, error: 'Access denied: Admin privileges required' };
      }

      let updatedUser: User | null = null;

      // Handle user profile updates using service role
      if (updateData.email || updateData.full_name) {
        const updatePayload: any = {};
        
        if (updateData.email) {
          updatePayload.email = updateData.email;
        }
        
        if (updateData.full_name) {
          updatePayload.user_metadata = { full_name: updateData.full_name };
        }

        const { data, error: userUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          updatePayload
        );

        if (userUpdateError) {
          return { data: null, error: userUpdateError.message };
        }

        updatedUser = data.user;
      }

      // Handle role updates using service role
      if (updateData.role_ids !== undefined) {
        // First, remove all existing roles
        const { error: deleteError } = await supabaseAdmin
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

          const { error: insertError } = await supabaseAdmin
            .from('user_roles')
            .insert(roleInserts);

          if (insertError) {
            return { data: null, error: insertError.message };
          }
        }
      }

      // If we didn't get an updated user from profile changes, fetch the user
      if (!updatedUser) {
        const { data: { user }, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (fetchError) {
          return { data: null, error: fetchError.message };
        }
        updatedUser = user;
      }

      return { data: updatedUser, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Delete user (Admin only)
  static async deleteUser(userId: string): Promise<{ error: string | null }> {
    try {
      // Check if current user is admin first
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { error: 'Access denied: Admin privileges required' };
      }

      // First, remove user roles
      const { error: roleDeleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleDeleteError) {
        console.error('Failed to delete user roles:', roleDeleteError);
      }

      // Then delete the user using service role
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (deleteError) {
        return { error: deleteError.message };
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