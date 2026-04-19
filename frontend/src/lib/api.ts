import axios from 'axios';

export const API_BASE = 'http://127.0.0.1:5000/api';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTrending = async () => {
  const { data } = await api.get('/tmdb/trending');
  return data;
};

export const getMovieDetails = async (id: number) => {
  const { data } = await api.get(`/tmdb/movie/${id}`);
  return data;
};

export const getHybridRecommendations = async (uid: string, movieId: number) => {
  const { data } = await api.get(`/recommend/hybrid`, {
    params: { uid, movie_id: movieId },
  });
  return data;
};

export const searchMovies = async (query: string) => {
  const { data } = await api.get(`/tmdb/search`, {
    params: { query },
  });
  return data;
};

// --- User Interaction Actions ---

export const addMovieToFavorites = async (uid: string, movieId: number) => {
  await api.post('/favorites', { uid, movieId });
};

export const removeMovieFromFavorites = async (uid: string, movieId: number) => {
  await api.delete('/favorites', { data: { uid, movieId } });
};

export const addMovieRating = async (uid: string, movieId: number, rating: number) => {
  await api.post('/ratings', { uid, movieId, rating });
};

export const addMovieToHistory = async (uid: string, movieId: number) => {
  await api.post('/history', { uid, movieId });
};

export const formatImageUrl = (path: string) => {
  if (!path) return 'https://via.placeholder.com/1920x1080?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}${path}`;
};

export default api;
