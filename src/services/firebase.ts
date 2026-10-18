import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Trigger Google Sign In via standard popup
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

/**
 * Sign in as anonymous guest user for preview and testing
 */
export async function signInGuest(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (err: any) {
    console.error('Guest Sign-In failed:', err);
    throw err;
  }
}

/**
 * Sign out current authenticated session
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err: any) {
    console.error('Sign out error:', err);
    throw err;
  }
}

/**
 * Save user profile state to Firestore
 */
export async function saveUserProfileToCloud(userId: string, profileData: any): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { profile: profileData, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Could not save user profile to cloud (offline or permission):', err);
  }
}

/**
 * Retrieve user profile state from Firestore
 */
export async function getUserProfileFromCloud(userId: string): Promise<any | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data()?.profile || null;
    }
  } catch (err) {
    console.warn('Could not fetch user profile from cloud:', err);
  }
  return null;
}

export { onAuthStateChanged };
export type { User };
