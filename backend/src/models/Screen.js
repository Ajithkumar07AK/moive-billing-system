/**
 * Screen Schema definition
 * Fields: { name, type (IMAX/Dolby/Standard), rows, seatsPerRow, seatLayout, seatTypePricing }
 */

export const ScreenSchema = {
  name: { type: String, required: true },
  type: { type: String, enum: ['IMAX', 'Dolby', 'Standard'], default: 'Standard' },
  tagline: { type: String },
  features: [{ type: String }],
  rows: [{ type: String }],
  seatsPerRow: { type: Number, default: 10 },
  seatTypePricing: {
    standard: { type: Number, default: 250 },
    premium: { type: Number, default: 400 },
    recliner: { type: Number, default: 650 },
  },
};
