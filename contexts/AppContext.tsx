
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { SavedProfile, DominantSecondaryProfile, ProfileColor } from '../types';
import { MOCK_USER_ID } from '../constants';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: SavedProfile | null;
  setUserProfile: (profile: SavedProfile | null) => void;
  savedProfiles: SavedProfile[];
  addProfile: (profile: Omit<SavedProfile, 'id' | 'isPrimaryUser'>) => void;
  updateProfile: (profile: SavedProfile) => void;
  deleteProfile: (profileId: string) => void;
  setAsPrimaryProfile: (profileId: string) => void;
  adaptabilityScore: number | null;
  setAdaptabilityScore: React.Dispatch<React.SetStateAction<number | null>>;
  adaptabilityNotes: string;
  setAdaptabilityNotes: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Start as not authenticated
  const [userProfile, setUserProfileState] = useState<SavedProfile | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [adaptabilityScore, setAdaptabilityScore] = useState<number | null>(null);
  const [adaptabilityNotes, setAdaptabilityNotes] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('behavioralCoachIsAuthenticated');
    if (storedAuth) setIsAuthenticated(JSON.parse(storedAuth));
    
    const storedUserProfile = localStorage.getItem('behavioralCoachUserProfile');
    if (storedUserProfile) setUserProfileState(JSON.parse(storedUserProfile));

    const storedProfiles = localStorage.getItem('behavioralCoachSavedProfiles');
    if (storedProfiles) setSavedProfiles(JSON.parse(storedProfiles));

    const storedAdaptabilityScore = localStorage.getItem('behavioralCoachAdaptabilityScore');
    if (storedAdaptabilityScore) setAdaptabilityScore(JSON.parse(storedAdaptabilityScore));

    const storedAdaptabilityNotes = localStorage.getItem('behavioralCoachAdaptabilityNotes');
    if (storedAdaptabilityNotes) setAdaptabilityNotes(storedAdaptabilityNotes);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('behavioralCoachIsAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('behavioralCoachUserProfile', JSON.stringify(userProfile));
  }, [userProfile]);
  
  useEffect(() => {
    localStorage.setItem('behavioralCoachSavedProfiles', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  useEffect(() => {
    localStorage.setItem('behavioralCoachAdaptabilityScore', JSON.stringify(adaptabilityScore));
  }, [adaptabilityScore]);

  useEffect(() => {
    localStorage.setItem('behavioralCoachAdaptabilityNotes', JSON.stringify(adaptabilityNotes));
  }, [adaptabilityNotes]);


  const setUserProfile = (profile: SavedProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
        setSavedProfiles(prev => {
            const existing = prev.find(p => p.id === profile.id);
            if(existing) return prev.map(p => p.id === profile.id ? {...profile, isPrimaryUser: true} : {...p, isPrimaryUser: false});
            return [{...profile, isPrimaryUser: true}, ...prev.map(p => ({...p, isPrimaryUser: false}))];
        });
    } else { // if unsetting primary, make sure no other profile is primary.
         setSavedProfiles(prev => prev.map(p => ({...p, isPrimaryUser: false})));
    }
  };
  
  const addProfile = (profileData: Omit<SavedProfile, 'id' | 'isPrimaryUser'>) => {
    const newProfile: SavedProfile = { 
        ...profileData, 
        id: Date.now().toString(), 
        isPrimaryUser: false 
    };
    if (profileData.name.toLowerCase() === 'moi-même' || profileData.name.toLowerCase() === 'my self') {
      newProfile.isPrimaryUser = true;
      setUserProfileState(newProfile); // also set as userProfile
      // Ensure other profiles are not primary
      setSavedProfiles(prev => [newProfile, ...prev.map(p => ({...p, isPrimaryUser: false}))]);
    } else {
      setSavedProfiles(prev => [newProfile, ...prev]);
    }
  };

  const updateProfile = (updatedProfile: SavedProfile) => {
    setSavedProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    if (updatedProfile.isPrimaryUser) {
        setUserProfileState(updatedProfile);
    } else if (userProfile?.id === updatedProfile.id && !updatedProfile.isPrimaryUser) {
        // If current primary user profile is updated to not be primary, clear userProfile state
        setUserProfileState(null);
    }
  };

  const deleteProfile = (profileId: string) => {
    setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
    if (userProfile?.id === profileId) {
      setUserProfileState(null);
    }
  };

  const setAsPrimaryProfile = (profileId: string) => {
    let newPrimaryProfile: SavedProfile | null = null;
    const updatedList = savedProfiles.map(p => {
        const isPrimary = p.id === profileId;
        if(isPrimary) newPrimaryProfile = {...p, isPrimaryUser: true};
        return {...p, isPrimaryUser: isPrimary };
    });
    setSavedProfiles(updatedList);
    setUserProfileState(newPrimaryProfile);
  };


  return (
    <AppContext.Provider value={{ 
      isAuthenticated, setIsAuthenticated,
      userProfile, setUserProfile,
      savedProfiles, addProfile, updateProfile, deleteProfile, setAsPrimaryProfile,
      adaptabilityScore, setAdaptabilityScore,
      adaptabilityNotes, setAdaptabilityNotes
    }}>
      {children}
    </AppContext.Provider>
  );
};
