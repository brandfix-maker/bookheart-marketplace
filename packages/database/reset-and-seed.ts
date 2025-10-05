import { db } from './client';
import { users, books, bookImages } from './schema';
import { seedDatabase } from './seed';

async function resetAndSeed() {
  try {
    console.log('🗑️ Clearing existing data...');
    
    // Clear all tables in correct order (respecting foreign key constraints)
    await db.delete(bookImages);
    console.log('✅ Cleared book images');
    
    await db.delete(books);
    console.log('✅ Cleared books');
    
    await db.delete(users);
    console.log('✅ Cleared users');
    
    console.log('🌱 Starting fresh seeding...');
    await seedDatabase();
    
    console.log('🎉 Reset and seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Reset and seed failed:', error);
    throw error;
  }
}

if (require.main === module) {
  resetAndSeed()
    .then(() => {
      console.log('🎉 Reset and seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Reset and seed script failed:', error);
      process.exit(1);
    });
}

export { resetAndSeed };
