import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const AuthContext = createContext();
const CACHE_KEY = 'sa_user_cache';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined = not yet resolved
  const [userData, setUserData] = useState(() => {
    // Instantly restore from localStorage so UI renders immediately
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const profileUnsubRef = useRef(null);

  async function signup(email, password, name, role = 'passenger', extraDetails = {}) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      
      let photoURL = '';
      if (extraDetails.profilePicFile) {
        try {
          const fileRef = ref(storage, `profile_pics/${user.uid}_${Date.now()}`);
          const uploadResult = await uploadBytes(fileRef, extraDetails.profilePicFile);
          photoURL = await getDownloadURL(uploadResult.ref);
        } catch (e) {
          console.error("Profile pic upload failed:", e);
        }
      }

      const cleanExtraDetails = { ...extraDetails, profilePic: photoURL };
      delete cleanExtraDetails.profilePicFile;

      // Attempt to update profile, but don't block if it's slow
      updateProfile(user, { 
        displayName: name,
        photoURL: photoURL
      }).catch(err => console.warn("Profile update non-critical failure:", err));

      const newData = {
        uid: user.uid,
        name,
        email,
        role,
        status: role === 'driver' ? 'pending' : 'active',
        ...cleanExtraDetails,
        createdAt: new Date().toISOString(),
      };

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, newData);

      if (role === 'driver') {
        await setDoc(doc(db, 'driverApplications', user.uid), {
          ...newData,
          appliedAt: new Date().toISOString(),
        }).catch(err => console.warn("Driver app write non-critical failure:", err));
      }

      setUserData(newData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
      return newData;
    } catch (error) {
      console.error("Signup process error:", error);
      throw error;
    }
  }

  async function login(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', res.user.uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setUserData(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    }
    const fallbackRole = res.user.email?.includes('admin') ? 'admin' : 'passenger';
    const fallbackData = { uid: res.user.uid, role: fallbackRole, status: 'active', email: res.user.email, name: res.user.displayName || 'User' };
    setUserData(fallbackData);
    localStorage.setItem(CACHE_KEY, JSON.stringify(fallbackData));
    return fallbackData;
  }

  function logout() {
    localStorage.removeItem(CACHE_KEY);
    setUserData(null);
    setCurrentUser(null);
    if (profileUnsubRef.current) { profileUnsubRef.current(); profileUnsubRef.current = null; }
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ?? null);

      // Clean up old profile listener
      if (profileUnsubRef.current) {
        profileUnsubRef.current();
        profileUnsubRef.current = null;
      }

      if (user) {
        // Subscribe real-time profile, but don't block render
        profileUnsubRef.current = onSnapshot(
          doc(db, 'users', user.uid),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setUserData(data);
              localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            } else {
              const fallback = {
                uid: user.uid,
                role: user.email?.includes('admin') ? 'admin' : 'passenger',
                status: 'active',
                email: user.email,
                name: user.displayName || 'User',
              };
              setUserData(fallback);
              localStorage.setItem(CACHE_KEY, JSON.stringify(fallback));
            }
          },
          (err) => {
            console.warn('Profile snapshot error:', err.code);
            // Don't clear userData — keep cached version
          }
        );
      } else {
        setUserData(null);
        localStorage.removeItem(CACHE_KEY);
      }
    });

    return () => {
      unsub();
      if (profileUnsubRef.current) profileUnsubRef.current();
    };
  }, []);

  // Only block render if auth state is truly unknown (very brief, < 300ms typically)
  if (currentUser === undefined) {
    return (
      <div style={{
        height: '100vh', width: '100vw',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#f0faf8 0%,#e8f5f3 100%)',
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 48, height: 48,
          border: '4px solid rgba(15,118,110,0.15)',
          borderTop: '4px solid #0f766e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontWeight: 700, color: '#0f766e', fontSize: 14, letterSpacing: 1 }}>SMART ADDA</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, userData, signup, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
