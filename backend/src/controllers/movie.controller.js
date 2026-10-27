import { dbStore } from '../services/store.js';
import { apiResponse } from '../utils/apiResponse.js';
import { CATEGORIES } from '../utils/constants.js';

export const MovieController = {
  getAll: async (req, res, next) => {
    try {
      const { category, search, status, available } = req.query;
      let movies = Array.from(dbStore.movies.values());

      if (status) {
        movies = movies.filter((m) => m.status === status);
      }

      if (available === 'true') {
        movies = movies.filter((m) => m.status === 'now_showing');
      }

      if (category && category !== 'All') {
        movies = movies.filter(
          (m) =>
            m.category.toLowerCase() === category.toLowerCase() ||
            m.genres?.some((g) => g.toLowerCase() === category.toLowerCase())
        );
      }

      if (search) {
        const q = search.toLowerCase();
        movies = movies.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.cast?.some((c) => c.toLowerCase().includes(q))
        );
      }

      return apiResponse(res, 200, true, 'Movies retrieved', movies);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const movie = dbStore.movies.get(id);
      if (!movie) {
        return apiResponse(res, 404, false, 'Movie not found');
      }
      return apiResponse(res, 200, true, 'Movie found', movie);
    } catch (err) {
      next(err);
    }
  },

  getCategories: async (req, res) => {
    return apiResponse(res, 200, true, 'Categories fetched', CATEGORIES);
  },

  getShowsByMovie: async (req, res, next) => {
    try {
      const { id: movieId } = req.params;
      const { date } = req.query;
      const targetDate = date || new Date().toISOString().slice(0, 10);

      const allShows = Array.from(dbStore.shows.values());
      const filteredShows = allShows.filter(
        (s) => s.movieId === movieId && s.date === targetDate
      );

      // Group shows by screen
      const screenList = Array.from(dbStore.screens.values());
      const grouped = screenList.map((sc) => {
        const screenShows = filteredShows.filter((s) => s.screenId === sc._id);
        return {
          screen: sc,
          shows: screenShows,
        };
      });

      return apiResponse(res, 200, true, 'Screen shows fetched', grouped);
    } catch (err) {
      next(err);
    }
  },
};
