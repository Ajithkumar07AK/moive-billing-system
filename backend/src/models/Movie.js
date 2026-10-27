/**
 * Movie Schema definition
 * Fields: { title, description, posterUrl, bannerUrl, trailerUrl, genres[], category, language, duration, rating, releaseDate, cast[], status }
 */

export const MovieSchema = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  posterUrl: { type: String, required: true },
  bannerUrl: { type: String },
  trailerUrl: { type: String },
  genres: [{ type: String }],
  category: { type: String, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  rating: { type: Number, default: 8.5 },
  certification: { type: String, default: 'PG-13' },
  releaseDate: { type: String, required: true },
  cast: [{ type: String }],
  director: { type: String },
  status: { type: String, enum: ['now_showing', 'coming_soon'], default: 'now_showing' },
  featured: { type: Boolean, default: false },
};
