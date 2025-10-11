'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

/**
 * BookSpine Component Props Interface
 */
export interface BookSpineProps {
  /**
   * Path to the book spine image (relative to /public/)
   */
  imagePath: string;
  
  /**
   * Size preset for the book spine
   * - sm: 60px width
   * - md: 100px width
   * - lg: 150px width
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Duration of the floating animation in seconds
   * @default 4
   */
  floatDuration?: number;
  
  /**
   * Strength of the parallax effect (0-1)
   * 0 = no parallax, 1 = strong parallax
   * @default 0.3
   */
  parallaxStrength?: number;
  
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  
  /**
   * Alt text for accessibility
   * @default 'Decorative book spine'
   */
  alt?: string;
}

/**
 * Size preset mappings
 */
const SIZE_PRESETS = {
  sm: { width: 60, height: 200 }, // Approximate aspect ratio
  md: { width: 100, height: 333 },
  lg: { width: 150, height: 500 },
} as const;

/**
 * BookSpine Component
 * 
 * A decorative component that displays book spine images with floating
 * and parallax animations. Designed to add visual interest to pages.
 * 
 * @example
 * ```tsx
 * <div className="relative">
 *   <BookSpine 
 *     imagePath="/BookHeart_BookSpine/BS_1/BS_1.png"
 *     size="md"
 *     floatDuration={4}
 *     parallaxStrength={0.3}
 *     className="left-10 top-20"
 *   />
 * </div>
 * ```
 */
export const BookSpine: React.FC<BookSpineProps> = ({
  imagePath,
  size = 'md',
  floatDuration = 4,
  parallaxStrength = 0.3,
  className = '',
  alt = 'Decorative book spine',
}) => {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const spineRef = useRef<HTMLDivElement>(null);

  // Lightweight parallax effect using scroll position
  useEffect(() => {
    if (parallaxStrength === 0) return;

    const handleScroll = () => {
      if (!spineRef.current) return;

      const rect = spineRef.current.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      
      // Calculate offset based on distance from viewport center
      const distance = elementCenter - viewportCenter;
      const offset = distance * parallaxStrength * 0.1;
      
      setParallaxOffset(offset);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [parallaxStrength]);

  const sizePreset = SIZE_PRESETS[size];

  // Generate unique animation name based on float duration
  const animationName = `float-${floatDuration}s`;

  return (
    <>
      {/* Inline keyframe animation */}
      <style jsx>{`
        @keyframes ${animationName} {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-12px) translateX(0);
          }
        }
      `}</style>

      <div
        ref={spineRef}
        className={`absolute pointer-events-auto ${className}`}
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            width: `${sizePreset.width}px`,
            height: 'auto',
            animation: `${animationName} ${floatDuration}s ease-in-out infinite`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
            willChange: 'transform',
          }}
        >
          <Image
            src={imagePath}
            alt={alt}
            width={sizePreset.width}
            height={sizePreset.height}
            loading="lazy"
            quality={90}
            className="w-full h-auto select-none"
            draggable={false}
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BookSpine;

