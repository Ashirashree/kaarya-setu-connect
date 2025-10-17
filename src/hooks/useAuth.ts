import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  username?: string | null;
  email?: string | null;
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
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    // Check for existing session only once
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const normalizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    return digits ? `+${digits}` : '';
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    full_name: string;
    phone: string;
    user_type: 'worker' | 'employer';
    location: string;
  }) => {
    try {
      const normalizedPhone = userData.phone ? normalizePhone(userData.phone) : null;

      let data, error;
      if (normalizedPhone) {
        ({ data, error } = await supabase.auth.signUp({
          phone: normalizedPhone,
          password,
          options: {
            data: {
              full_name: userData.full_name,
              user_type: userData.user_type,
              location: userData.location,
              phone: normalizedPhone
            }
          }
        } as any));
      } else {
        ({ data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: userData
          }
        }));
      }

      if (error) throw error;

      if (data.user) {
        // Create profile using the user from signup response
        const profileResult = await createProfileForUser(data.user.id, {
          ...userData,
          phone: normalizedPhone || userData.phone,
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

      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully."
      });
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

  const signIn = async (identifier: string, password: string) => {
    try {
      // Clean up any stale auth state before attempting a new sign-in
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
        if (typeof sessionStorage !== 'undefined') {
          Object.keys(sessionStorage).forEach((key) => {
            if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
              sessionStorage.removeItem(key);
            }
          });
        }
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (_) {
          // ignore
        }
      } catch (_) {
        // ignore cleanup errors
      }

      // Determine if identifier is an email or a phone number
      let data, error;

      if (identifier.includes('@')) {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: identifier.trim(),
          password
        }));
      } else {
        const phone = normalizePhone(identifier.trim());
        ({ data, error } = await supabase.auth.signInWithPassword({
          phone,
          password
        } as any));
      }

      if (error) throw error;

      toast({
        title: "Login Successful!",
        description: "Welcome back to Ruralink"
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

  // Username-based auth helpers
  const usernameToEmail = (raw: string) => {
    const username = raw.trim().toLowerCase();
    return `${username}@ruralink.local`;
  };

  const signUpWithUsername = async (username: string, password: string, userType: 'worker' | 'employer' = 'worker') => {
    try {
      const email = usernameToEmail(username);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username.trim().toLowerCase(),
            full_name: username,
            user_type: userType
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        await createProfileForUser(data.user.id, {
          full_name: username,
          user_type: userType,
          location: '',
          phone: '',
          email,
          username: username.trim().toLowerCase()
        });
      }

      toast({ title: 'Registration Successful!', description: 'Your account has been created successfully.' });
      return { success: true, data };
    } catch (error: any) {
      toast({ title: 'Registration Failed', description: error.message || 'Failed to create account', variant: 'destructive' });
      return { success: false, error: error.message };
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const email = usernameToEmail(username);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: 'Login Successful!', description: 'Welcome back to Ruralink' });
      return { success: true, data };
    } catch (error: any) {
      toast({ title: 'Login Failed', description: error.message || 'Invalid credentials', variant: 'destructive' });
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
        description: "Welcome to Ruralink. Start exploring opportunities!"
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
    email?: string;
    username?: string;
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
        description: "Welcome to Ruralink. Start exploring opportunities!"
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
    signUpWithUsername,
    signInWithUsername,
    createProfile,
    signOut,
    fetchProfile
  };
}