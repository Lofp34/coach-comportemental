import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, SavedProfile, AppContextType } from '../types';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adaptabilityScore, setAdaptabilityScore] = useState<number | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // Ignore 'range not found' errors for new users
          console.error('Error fetching user profile:', error);
        } else if (data) {
          setUserProfile({
            id: data.id,
            username: data.username,
            fullName: data.full_name,
            avatarUrl: data.avatar_url,
            profileResult: data.profile_result || [],
            adaptabilityScore: data.adaptability_score,
          });
          setAdaptabilityScore(data.adaptability_score);
        }
      };

      fetchUserProfile();
    } else {
      setUserProfile(null);
      setAdaptabilityScore(null);
      setSavedProfiles([]);
    }
  }, [user]);


  const contextValue: AppContextType = {
    isAuthenticated: !!session,
    user,
    userProfile,
    setUserProfile,
    adaptabilityScore,
    savedProfiles,
    isLoading,
    setAdaptabilityScore,
    setSavedProfiles,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {!isLoading && children}
    </AppContext.Provider>
  );
};
