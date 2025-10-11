/**
 * BookSpine Image Library
 * 
 * Centralized collection of all available book spine images.
 * Use these paths with the BookSpine component.
 */

export const BOOK_SPINES = {
  BS_1: {
    png: '/BookHeart_BookSpine/BS_1/BS_1.png',
    svg: '/BookHeart_BookSpine/BS_1/BS_1.svg',
    png2x: '/BookHeart_BookSpine/BS_1/BS_1@2x.png',
    png3x: '/BookHeart_BookSpine/BS_1/BS_1@3x.png',
  },
  BS_2: {
    png: '/BookHeart_BookSpine/BS_2/BS_2.png',
    svg: '/BookHeart_BookSpine/BS_2/BS_2.svg',
    png2x: '/BookHeart_BookSpine/BS_2/BS_2@2x.png',
    png3x: '/BookHeart_BookSpine/BS_2/BS_2@3x.png',
  },
  BS_3: {
    png: '/BookHeart_BookSpine/BS_3/BS_3.png',
    svg: '/BookHeart_BookSpine/BS_3/BS_3.svg',
    png2x: '/BookHeart_BookSpine/BS_3/BS_3@2x.png',
    png3x: '/BookHeart_BookSpine/BS_3/BS_3@3x.png',
  },
  BS_4: {
    png: '/BookHeart_BookSpine/BS_4/BS_4.png',
    svg: '/BookHeart_BookSpine/BS_4/BS_4.svg',
    png2x: '/BookHeart_BookSpine/BS_4/BS_4@2x.png',
    png3x: '/BookHeart_BookSpine/BS_4/BS_4@3x.png',
  },
  BS_5: {
    png: '/BookHeart_BookSpine/BS_5/BS_5.png',
    svg: '/BookHeart_BookSpine/BS_5/BS_5.svg',
    png2x: '/BookHeart_BookSpine/BS_5/BS_5@2x.png',
    png3x: '/BookHeart_BookSpine/BS_5/BS_5@3x.png',
  },
  BS_6: {
    png: '/BookHeart_BookSpine/BS_6/BS_6.png',
    svg: '/BookHeart_BookSpine/BS_6/BS_6.svg',
    png2x: '/BookHeart_BookSpine/BS_6/BS_6@2x.png',
    png3x: '/BookHeart_BookSpine/BS_6/BS_6@3x.png',
  },
  BS_7: {
    png: '/BookHeart_BookSpine/BS_7/BS_7.png',
    svg: '/BookHeart_BookSpine/BS_7/BS_7.svg',
    png2x: '/BookHeart_BookSpine/BS_7/BS_7@2x.png',
    png3x: '/BookHeart_BookSpine/BS_7/BS_7@3x.png',
  },
  BS_8: {
    png: '/BookHeart_BookSpine/BS_8/BS_8.png',
    svg: '/BookHeart_BookSpine/BS_8/BS_8.svg',
    png2x: '/BookHeart_BookSpine/BS_8/BS_8@2x.png',
    png3x: '/BookHeart_BookSpine/BS_8/BS_8@3x.png',
  },
  BS_9: {
    png: '/BookHeart_BookSpine/BS_9/BS_9.png',
    svg: '/BookHeart_BookSpine/BS_9/BS_9.svg',
    png2x: '/BookHeart_BookSpine/BS_9/BS_9@2x.png',
    png3x: '/BookHeart_BookSpine/BS_9/BS_9@3x.png',
  },
  BS_10: {
    png: '/BookHeart_BookSpine/BS_10/BS_10.png',
    svg: '/BookHeart_BookSpine/BS_10/BS_10.svg',
    png2x: '/BookHeart_BookSpine/BS_10/BS_10@2x.png',
    png3x: '/BookHeart_BookSpine/BS_10/BS_10@3x.png',
  },
} as const;

/**
 * Get a random book spine image path
 * @param format - The image format to use ('png', 'svg', 'png2x', 'png3x')
 * @returns Random book spine image path
 */
export function getRandomBookSpine(format: 'png' | 'svg' | 'png2x' | 'png3x' = 'png'): string {
  const keys = Object.keys(BOOK_SPINES) as Array<keyof typeof BOOK_SPINES>;
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return BOOK_SPINES[randomKey][format];
}

/**
 * Get all book spine paths for a specific format
 * @param format - The image format to use
 * @returns Array of all book spine paths
 */
export function getAllBookSpines(format: 'png' | 'svg' | 'png2x' | 'png3x' = 'png'): string[] {
  return Object.values(BOOK_SPINES).map(spine => spine[format]);
}

/**
 * Get a specific book spine by number
 * @param number - Book spine number (1-10)
 * @param format - The image format to use
 * @returns Book spine image path or undefined if not found
 */
export function getBookSpine(
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  format: 'png' | 'svg' | 'png2x' | 'png3x' = 'png'
): string | undefined {
  const key = `BS_${number}` as keyof typeof BOOK_SPINES;
  return BOOK_SPINES[key]?.[format];
}

export default BOOK_SPINES;

