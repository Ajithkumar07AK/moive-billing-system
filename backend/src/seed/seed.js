import { dbStore } from '../services/store.js';

export async function runSeed() {
  console.log('Seeding Infinity Cinema database...');
  dbStore.seed();
  console.log(`Seeded:`);
  console.log(` - ${dbStore.users.size} Users (Demo: demo@cinema.com / Demo@123)`);
  console.log(` - ${dbStore.screens.size} Screens (IMAX, Dolby Atmos, Prestige Standard)`);
  console.log(` - ${dbStore.movies.size} Feature Films across Anime, Sci-Fi, Action, Drama, Horror`);
  console.log(` - ${dbStore.shows.size} Scheduled Shows for the next 7 days`);
  console.log('Seed completed successfully!');
}

// Run standalone if called directly
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed();
}
