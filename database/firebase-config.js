import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// Your Firebase configuration
// IMPORTANT: Please replace these placeholder values with your actual Firebase project keys later!
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------------------------------------------------
// Firebase Firestore Database Functions
// ---------------------------------------------------------

// --- 1. User Info ---
export const saveUserInfo = async (uid, userData) => {
  try {
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: new Date().toISOString()
    }, { merge: true });
    console.log("User info saved to Firebase!");
  } catch (error) {
    console.error("Error saving user info: ", error);
  }
};

export const getUserInfo = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user info: ", error);
    return null;
  }
};

// --- 2. Watch History ---
export const addToWatchHistory = async (uid, movieId) => {
  try {
    const historyRef = doc(db, "watch_history", uid);
    await setDoc(historyRef, {
      history: arrayUnion({ movieId, watchedAt: new Date().toISOString() })
    }, { merge: true });
    console.log("Watch history updated in Firebase!");
  } catch (error) {
    console.error("Error updating watch history: ", error);
  }
};

// --- 3. Ratings ---
export const addRating = async (uid, movieId, rating) => {
  try {
    const ratingsRef = doc(db, "ratings", uid);
    await setDoc(ratingsRef, {
      userRatings: arrayUnion({ movieId, rating, ratedAt: new Date().toISOString() })
    }, { merge: true });
    console.log("Rating saved to Firebase!");
  } catch (error) {
    console.error("Error saving rating: ", error);
  }
};

// --- 4. Favorite Movies ---
export const addToFavorites = async (uid, movieId) => {
  try {
    const favoritesRef = doc(db, "favorites", uid);
    await setDoc(favoritesRef, {
      favoriteMovies: arrayUnion(movieId)
    }, { merge: true });
    console.log("Movie added to Firebase favorites!");
  } catch (error) {
    console.error("Error adding to favorites: ", error);
  }
};

export const removeFromFavorites = async (uid, movieId) => {
  try {
    const favoritesRef = doc(db, "favorites", uid);
    await updateDoc(favoritesRef, {
      favoriteMovies: arrayRemove(movieId)
    });
    console.log("Movie removed from Firebase favorites!");
  } catch (error) {
    console.error("Error removing from favorites: ", error);
  }
};

export { db };
