/**
 * database/firebase-config.js
 * 
 * We have replaced the complicated Firebase configuration with a local API backend database 
 * so you don't need any Google accounts or 2FA to make your backend work!
 * These functions act exactly like the Firebase ones but hit your Python backend.
 */

const API_BASE = 'http://localhost:5000/api';

// --- 1. User Info ---
export const saveUserInfo = async (uid, userData) => {
  try {
    await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, ...userData })
    });
    console.log("User info saved (SQLite)!");
  } catch (error) {
    console.error("Error saving user info: ", error);
  }
};

export const getUserInfo = async (uid) => {
  try {
    const res = await fetch(`${API_BASE}/users/${uid}`);
    if (res.ok) {
        return await res.json();
    }
    return null;
  } catch (error) {
    console.error("Error getting user info: ", error);
    return null;
  }
};

// --- 2. Watch History ---
export const addToWatchHistory = async (uid, movieId) => {
  try {
    await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, movieId })
    });
    console.log("Watch history updated (SQLite)!");
  } catch (error) {
    console.error("Error updating watch history: ", error);
  }
};

// --- 3. Ratings ---
export const addRating = async (uid, movieId, rating) => {
  try {
    await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, movieId, rating })
    });
    console.log("Rating saved (SQLite)!");
  } catch (error) {
    console.error("Error saving rating: ", error);
  }
};

// --- 4. Favorite Movies ---
export const addToFavorites = async (uid, movieId) => {
  try {
    await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, movieId })
    });
    console.log("Movie added to favorites (SQLite)!");
  } catch (error) {
    console.error("Error adding to favorites: ", error);
  }
};

export const removeFromFavorites = async (uid, movieId) => {
  try {
    await fetch(`${API_BASE}/favorites`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, movieId })
    });
    console.log("Movie removed from favorites (SQLite)!");
  } catch (error) {
    console.error("Error removing from favorites: ", error);
  }
};
