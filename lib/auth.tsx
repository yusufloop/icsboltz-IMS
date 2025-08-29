import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, useSegments } from "expo-router";
import { Platform } from "react-native";
import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

// Extended user type that includes role information
interface ExtendedUser extends User {
  roles?: string[];
  roleIds?: number[];
  user_roles?: {
    role_id: number;
    role: {
      role_id: number;
      role_name: string;
    };
  }[];
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<{ error?: string; success?: boolean; data?: any }>;
  register: (credentials: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    confirmPassword: string; 
  }) => Promise<{ error?: string; success?: boolean; message?: string; data?: any }>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyEmail: (data: { email: string; verification_code: string }) => Promise<{ error?: string; success?: boolean }>;
  resendVerificationCode: (email: string) => Promise<{ error?: string; success?: boolean }>;
  forgotPassword: (data: { email: string }) => Promise<{ error?: string; success?: boolean }>;
  resetPassword: (data: { reset_token: string; new_password: string; confirm_password: string }) => Promise<{ error?: string; success?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: string
  ) => Promise<{ error?: string; success?: boolean }>;
  signOut: () => Promise<void>;
  getUserRoles: () => string[];
  getRoleIds: () => number[];
  hasRole: (roleName: string) => boolean;
  hasRoleId: (roleId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const segments = useSegments();

  // Function to fetch user with roles
  const fetchUserWithRoles = async (userId: string): Promise<ExtendedUser | null> => {
    try {
      // Reduce timeout to 5 seconds and add better error handling
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout after 5 seconds')), 5000)
      );
      
      // Get current session to get user data first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.warn("No session found in fetchUserWithRoles");
        return null;
      }

      // Get user roles with role details
      const queryPromise = supabase
        .from("user_roles")
        .select(`
          role_id,
          role:roles (
            role_id,
            role_name
          )
        `)
        .eq("user_id", userId);

      let userRoles = [];
      try {
        const result = await Promise.race([queryPromise, timeoutPromise]) as any;
        if (result.error) {
          console.error("Error fetching user roles:", result.error);
          // Continue with empty roles instead of failing completely
          userRoles = [];
        } else {
          userRoles = result.data || [];
        }
      } catch (timeoutError) {
        console.error("Database timeout, continuing with empty roles:", timeoutError);
        userRoles = [];
      }

      // Extend user object with roles (even if empty)
      const extendedUser: ExtendedUser = {
        ...session.user,
        roles: userRoles?.map(ur => ur.role?.role_name).filter(Boolean) || [],
        roleIds: userRoles?.map(ur => ur.role_id).filter(Boolean) || [],
        user_roles: userRoles || []
      };

      return extendedUser;
    } catch (error) {
      console.error("Error in fetchUserWithRoles:", error);
      // Return basic user data without roles instead of null
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          ...session.user,
          roles: [],
          roleIds: [],
          user_roles: []
        };
      }
      return null;
    }
  };

  useEffect(() => {
    // Get initial session with timeout
    const initializeAuth = async () => {
      try {
        console.log("Platform:", Platform.OS, "- Initializing auth...");
        
        // Add a timeout for the entire auth initialization
        const authTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 15000)
        );
        
        const authProcess = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          console.log("Session retrieved:", !!session);
          setSession(session);
          
          if (session?.user) {
            console.log("Fetching user with roles for:", session.user.id);
            const userWithRoles = await fetchUserWithRoles(session.user.id);
            console.log("User with roles fetched:", !!userWithRoles);
            setUser(userWithRoles);
          } else {
            console.log("No session user found");
            setUser(null);
          }
        };

        await Promise.race([authProcess(), authTimeout]);
      } catch (error) {
        console.error("Error initializing auth:", error);
        // On Android, don't fail completely - set to not authenticated state
        setUser(null);
        setSession(null);
      } finally {
        console.log("Auth initialization complete, setting loading to false");
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === "SIGNED_IN" && session?.user) {
        const userWithRoles = await fetchUserWithRoles(session.user.id);
        setUser(userWithRoles);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to sign-in if not authenticated
      router.replace("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect to app if authenticated
      router.replace("/(app)/(tabs)");
    }
  }, [user, segments, loading]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Use Supabase's built-in authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        return { error: error.message, success: false };
      }

      if (!data.user) {
        return { error: "Failed to sign in", success: false };
      }

      // User will be set automatically by the auth state change listener
      return { success: true };
    } catch (err) {
      console.error("Sign in error:", err);
      return { error: "An unexpected error occurred", success: false };
    }
  }, []);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    fullName: string,
    role: string = "client" // Default role
  ) => {
    try {
      // Create user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        console.error("Sign up error:", authError);
        return { error: authError.message, success: false };
      }

      if (!authData.user) {
        return { error: "Failed to create account", success: false };
      }

      // Wait a bit for the user to be created in the database
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assign role to user
      try {
        // First, get the role_id for the specified role
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("role_id")
          .eq("role_name", role)
          .single();

        if (roleError || !roleData) {
          console.warn(`Role '${role}' not found, user created without role`);
        } else {
          // Assign role to user
          const { error: userRoleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: authData.user.id,
              role_id: roleData.role_id,
            });

          if (userRoleError) {
            console.error("Error assigning role:", userRoleError);
          }
        }
      } catch (roleAssignError) {
        console.error("Error in role assignment:", roleAssignError);
        // Don't fail the signup if role assignment fails
      }

      return { 
        success: true, 
        message: "Registration successful! Please check your email for verification." 
      };
    } catch (err) {
      console.error("Sign up error:", err);
      return { error: "An unexpected error occurred", success: false };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }, []);

  const getUserRoles = useCallback((): string[] => {
    return user?.roles || [];
  }, [user]);

  const getRoleIds = useCallback((): number[] => {
    return user?.roleIds || [];
  }, [user]);

  const hasRole = useCallback((roleName: string): boolean => {
    return user?.roles?.includes(roleName) || false;
  }, [user]);

  const hasRoleId = useCallback((roleId: number): boolean => {
    return user?.roleIds?.includes(roleId) || false;
  }, [user]);

  // Wrapper functions to match the expected interface
  const login = useCallback(async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    setError(null);
    const result = await signIn(credentials.email, credentials.password);
    if (result.error) {
      setError(result.error);
    }
    return result;
  }, [signIn]);

  const register = useCallback(async (credentials: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    confirmPassword: string; 
  }) => {
    setError(null);
    if (credentials.password !== credentials.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      return { error: errorMsg, success: false };
    }
    const fullName = `${credentials.firstName} ${credentials.lastName}`.trim();
    const result = await signUp(credentials.email, credentials.password, fullName);
    if (result.error) {
      setError(result.error);
    }
    return {
      ...result,
      message: result.success ? 'Registration successful!' : undefined
    };
  }, [signUp]);

  const logout = useCallback(async () => {
    setError(null);
    await signOut();
  }, [signOut]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Stub implementations for email verification (since we're using Supabase auth, these are handled by Supabase)
  const verifyEmail = useCallback(async (data: { email: string; verification_code: string }) => {
    // For now, return success as Supabase handles email verification
    return { success: true };
  }, []);

  const resendVerificationCode = useCallback(async (email: string) => {
    // For now, return success as Supabase handles email verification
    return { success: true };
  }, []);

  const forgotPassword = useCallback(async (data: { email: string }) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);
      if (error) {
        setError(error.message);
        return { error: error.message, success: false };
      }
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred';
      setError(errorMsg);
      return { error: errorMsg, success: false };
    }
  }, []);

  const resetPassword = useCallback(async (data: { reset_token: string; new_password: string; confirm_password: string }) => {
    try {
      setError(null);
      if (data.new_password !== data.confirm_password) {
        const errorMsg = 'Passwords do not match';
        setError(errorMsg);
        return { error: errorMsg, success: false };
      }
      // This would need to be implemented based on your reset flow
      // For now, returning success
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred';
      setError(errorMsg);
      return { error: errorMsg, success: false };
    }
  }, []);

  // Show loading screen while auth is initializing - React Native compatible
  if (loading) {
    const { View, Text } = require('react-native');
    return (
      <View style={{ 
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff'
      }}>
        <Text style={{ marginBottom: 16, fontSize: 16 }}>Initializing...</Text>
        <Text style={{ fontSize: 14, color: '#666666' }}>Loading authentication</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading,
        isAuthenticated: !!user,
        error,
        login,
        register,
        logout,
        clearError,
        verifyEmail,
        resendVerificationCode,
        forgotPassword,
        resetPassword,
        signIn,
        signUp,
        signOut,
        getUserRoles,
        getRoleIds,
        hasRole,
        hasRoleId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};