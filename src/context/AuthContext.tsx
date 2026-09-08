import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (rollNo: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { name: string; rollNo: string; email: string; branch: string; year: string; role: UserRole; password: string; clubName?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  allUsers: User[];
  authToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'skillbridge_current_user_v1';
const USERS_STORAGE_KEY = 'skillbridge_users_v1';
const AUTH_TOKEN_STORAGE_KEY = 'skillbridge_auth_token_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default to the first student user for instant seamless experience
    return INITIAL_USERS[0];
  });
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));

  // Sync to Remote MongoDB
  useEffect(() => {
    const fetchRemoteUsers = async () => {
      try {
        const res = await fetch('/api/auth/users');
        if (res.ok) {
          const remoteUsers: User[] = await res.json();
          if (remoteUsers && remoteUsers.length > 0) {
            setUsers(remoteUsers);
          }
        }
      } catch (err) {
        console.info('Remote auth sync note:', err);
      }
    };
    fetchRemoteUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const login = async (rollNo: string, email: string, _password: string, role?: UserRole) => {
    const cleanRoll = rollNo.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Call MongoDB Backend API
    try {
      const result = await api.login(cleanRoll, cleanEmail, role);
      if (result && result.user) {
        setCurrentUser(result.user);
        if (result.token) {
          setAuthToken(result.token);
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
        }
        setUsers(prev => {
          const exists = prev.some(u => u.id === result.user.id || u.rollNo === result.user.rollNo);
          return exists ? prev.map(u => u.id === result.user.id ? result.user : u) : [result.user, ...prev];
        });
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend login fallback to local state:', e);
    }

    // Local fallback
    let matched = users.find(
      u => u.rollNo.toUpperCase() === cleanRoll || u.email.toLowerCase() === cleanEmail
    );

    if (!matched) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: (email || rollNo || 'Student').split('@')[0].replace('.', ' ').toUpperCase(),
        rollNo: cleanRoll || `24CS${Math.floor(100 + Math.random() * 900)}`,
        email: cleanEmail,
        branch: 'Computer Science & Engg',
        year: role === 'senior' ? '3rd Year (Senior)' : role === 'admin' ? 'Faculty' : '1st Year (Fresher)',
        role: role || 'student',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        bio: 'SkillBridge student passionate about collaborative growth.',
        badges: [role === 'senior' ? 'Senior Mentor' : role === 'admin' ? 'Admin' : 'Explorer'],
        reputation: role === 'senior' ? 150 : 20,
      };
      setUsers(prev => [newUser, ...prev]);
      matched = newUser;
    }

    setCurrentUser(matched);
    return { success: true };
  };

  const register = async (userData: { name: string; rollNo: string; email: string; branch: string; year: string; role: UserRole; password: string; clubName?: string }) => {
    const cleanRoll = userData.rollNo.trim().toUpperCase();
    const cleanEmail = userData.email.trim().toLowerCase();

    // Call MongoDB Backend API to save to MongoDB Compass
    try {
      const result = await api.register({
        name: userData.name.trim(),
        rollNo: cleanRoll,
        email: cleanEmail,
        branch: userData.branch,
        year: userData.year,
        role: userData.role,
        clubName: userData.clubName,
      });

      if (result && result.user) {
        setCurrentUser(result.user);
        if (result.token) {
          setAuthToken(result.token);
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
        }
        setUsers(prev => {
          const exists = prev.some(u => u.id === result.user.id || u.rollNo === result.user.rollNo);
          return exists ? prev.map(u => u.id === result.user.id ? result.user : u) : [result.user, ...prev];
        });
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend register fallback to local state:', e);
    }

    // Local fallback
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name.trim(),
      rollNo: cleanRoll,
      email: cleanEmail,
      branch: userData.branch,
      year: userData.year,
      role: userData.role,
      clubName: userData.clubName,
      avatar: userData.role === 'senior' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : userData.role === 'admin'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: `${userData.role.toUpperCase()} | ${userData.branch} | Ready to build with SkillBridge.`,
      badges: [userData.role === 'senior' ? 'Senior Mentor' : userData.role === 'admin' ? 'Institute Admin' : userData.role === 'club_admin' ? 'Club Lead' : 'Campus Fresher'],
      reputation: userData.role === 'senior' ? 200 : userData.role === 'admin' ? 999 : 50,
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  };

  const switchDemoUser = (userId: string) => {
    const found = users.find(u => u.id === userId) || INITIAL_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setAuthToken(null);
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchDemoUser,
        allUsers: users,
        authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
