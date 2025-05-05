import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string) => Promise<{ error: Error | null, user: User | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider initializing...");
    
    // Check active sessions and set the user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth state changed: ${event}`, session ? "Session exists" : "No session");
        setUser(session?.user ?? null);
        setSession(session);
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log("Sign in successful:", data.user?.email);
        toast({
          title: "Welcome back!",
          description: `You've successfully signed in as ${data.user?.email}`,
          variant: "default"
        });
      }
      
      return { error: error as Error | null };
    } catch (error) {
      console.error("Sign in exception:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error: error as Error };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return { error: error as Error, user: null };
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account",
        variant: "default"
      });
      
      return { error: null, user: data.user };
    } catch (error) {
      console.error("Registration exception:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error: error as Error, user: null };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error("Google sign in error:", error.message);
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return { error: error as Error | null };
    } catch (error) {
      console.error("Google sign in exception:", error);
      toast({
        title: "Google sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out",
          variant: "default"
        });
      }
      
      return { error: error as Error | null };
    } catch (error) {
      console.error("Sign out exception:", error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error.message);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions",
          variant: "default"
        });
      }
      
      return { error: error as Error | null };
    } catch (error) {
      console.error("Password reset exception:", error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
