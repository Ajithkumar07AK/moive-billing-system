import { dbStore } from '../services/store.js';
import { apiResponse } from '../utils/apiResponse.js';

export const ScreenController = {
  getAll: async (req, res) => {
    const screens = Array.from(dbStore.screens.values());
    return apiResponse(res, 200, true, 'Screens retrieved', screens);
  },

  getById: async (req, res) => {
    const { id } = req.params;
    const screen = dbStore.screens.get(id);
    if (!screen) {
      return apiResponse(res, 404, false, 'Screen not found');
    }
    return apiResponse(res, 200, true, 'Screen found', screen);
  },
};
