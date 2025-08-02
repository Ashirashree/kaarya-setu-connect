import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  user_type: 'worker' | 'employer';
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    full_name: string;
    phone: string;
    user_type: 'worker' | 'employer';
    location: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile using the user from signup response
        const profileResult = await createProfileForUser(data.user.id, {
          ...userData,
          email
        });
        if (profileResult.success) {
          toast({
            title: "Registration Successful!",
            description: "Your account has been created successfully."
          });
          return { success: true, data };
        }
      }

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const signIn = async (phoneNumber: string, password: string) => {
    try {
      // Find user email by phone number
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('phone', phoneNumber)
        .maybeSingle();
        
      if (profileError) throw profileError;
      if (!profile?.email) {
        throw new Error('Phone number not found. Please check your phone number or register first.');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password
      });

      if (error) throw error;

      toast({
        title: "Login Successful!",
        description: "Welcome back to KaaryaSetu"
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const createProfile = async (profileData: {
    full_name: string;
    phone: string;
    user_type: 'worker' | 'employer';
    location: string;
  }) => {
    if (!user) throw new Error('No authenticated user');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data as Profile);
      toast({
        title: "Profile Created!",
        description: "Welcome to KaaryaSetu. Start exploring opportunities!"
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const createProfileForUser = async (userId: string, profileData: {
    full_name: string;
    phone: string;
    user_type: 'worker' | 'employer';
    location: string;
    email: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data as Profile);
      toast({
        title: "Profile Created!",
        description: "Welcome to KaaryaSetu. Start exploring opportunities!"
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };

      cleanupAuthState();

      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force reload even if signout fails
      window.location.href = '/';
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    createProfile,
    signOut,
    fetchProfile
  };
}