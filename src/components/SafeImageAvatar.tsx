import React, { useState, useEffect } from 'react';
// @ts-ignore
import mainIllustration from '../assets/images/regenerated_image_1783323785723.jpg';

interface SafeImageAvatarProps {
  src?: string;
  alt?: string;
  fallbackEmoji: string;
  className?: string;
  sizeClassName?: string; // e.g. "w-12 h-12"
}

const getCharacterIndex = (url?: string): number => {
  if (!url) return -1;
  const lowercase = url.toLowerCase();
  if (lowercase.includes('kehua')) return 5;
  if (lowercase.includes('bojun')) return 1;
  if (lowercase.includes('xiaowen')) return 0;
  if (lowercase.includes('xiaoping')) return 4;
  if (lowercase.includes('dad')) return 2;
  if (lowercase.includes('grandpa')) return 3;
  return -1;
};

export default function SafeImageAvatar({
  src,
  alt = 'Avatar',
  fallbackEmoji,
  className = '',
  sizeClassName = 'w-10 h-10'
}: SafeImageAvatarProps) {
  const [hasFailed, setHasFailed] = useState(false);

  // Reset failure state if src changes
  useEffect(() => {
    setHasFailed(false);
  }, [src]);

  const charIndex = getCharacterIndex(src);

  if (charIndex !== -1) {
    return (
      <div 
        className={`rounded-full overflow-hidden shrink-0 border border-amber-200/50 bg-amber-50/20 flex items-center justify-center relative ${sizeClassName} ${className}`}
        style={{
          backgroundImage: `url(${mainIllustration})`,
          backgroundSize: '600% 100%',
          backgroundPosition: `${charIndex * 20}% 0%`,
          backgroundRepeat: 'no-repeat'
        }}
        title={alt}
      />
    );
  }

  return (
    <div className={`rounded-full overflow-hidden shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center relative ${sizeClassName} ${className}`}>
      {/* Background Emoji Fallback */}
      <span className="text-xl select-none absolute pointer-events-none">{fallbackEmoji}</span>

      {/* Render Image only if src is provided and has not failed */}
      {src && !hasFailed && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            // Ensure opacity/reveal if needed
            e.currentTarget.style.opacity = '1';
          }}
          onError={() => {
            setHasFailed(true);
          }}
        />
      )}
    </div>
  );
}

