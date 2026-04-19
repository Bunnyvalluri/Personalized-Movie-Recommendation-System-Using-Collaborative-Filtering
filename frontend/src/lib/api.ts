import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

const api = axios.create({
  baseURL: API_BASE,
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

export const formatImageUrl = (path: string) => `${TMDB_IMAGE_BASE}${path}`;

export default api;
