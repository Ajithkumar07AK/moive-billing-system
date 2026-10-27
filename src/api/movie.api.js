import api from './axios.js';

export const movieApi = {
  getMovies: async (params = {}) => {
    return api.get('/movies', { params });
  },
  getMovieById: async (id) => {
    return api.get(`/movies/${id}`);
  },
  getCategories: async () => {
    return api.get('/movies/categories');
  },
  getMovieShows: async (movieId, date) => {
    return api.get(`/movies/${movieId}/shows`, { params: { date } });
  },
};
