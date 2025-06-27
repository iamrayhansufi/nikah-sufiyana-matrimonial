import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, User } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  sizes?: string;
}

/**
 * Optimized image component with lazy loading, error handling, and responsive sizing
 */
export default function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
  priority = false,
  fallbackSrc = '/placeholder-user.jpg',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Generate optimized image URL for Cloudinary
  const optimizeImageUrl = (url: string) => {
    if (!url || !url.includes('cloudinary')) {
      return url;
    }

    try {
      const urlParts = url.split('/upload/');
      if (urlParts.length !== 2) return url;

      const transformations = [
        `w_${width}`,
        `h_${height}`,
        'c_fill',
        'q_auto',
        'f_auto',
        'dpr_auto',
      ];

      return `${urlParts[0]}/upload/${transformations.join(',')}/${urlParts[1]}`;
    } catch {
      return url;
    }
  };

  const imageUrl = optimizeImageUrl(src);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ width, height }}
    >
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Error placeholder */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <User className="h-8 w-8 text-gray-400" />
        </div>
      )}

      {/* Actual image */}
      {(isInView || priority) && (
        <Image
          src={error ? fallbackSrc : imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </div>
  );
}

/**
 * Profile image component with specific optimizations for profile pictures
 */
export function ProfileImage({
  src,
  alt,
  size = 'md',
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}) {
  const sizeConfig = {
    sm: { width: 100, height: 100 },
    md: { width: 200, height: 200 },
    lg: { width: 300, height: 300 },
    xl: { width: 400, height: 400 },
  };

  const { width, height } = sizeConfig[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-full ${className}`}
      priority={priority}
      sizes={`${width}px`}
    />
  );
}

/**
 * Gallery image component for photo galleries
 */
export function GalleryImage({
  src,
  alt,
  onClick,
  className = '',
}: {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div 
      className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={250}
        height={250}
        className="rounded-lg"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  );
}

/**
 * Preload images for better performance
 */
export function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}
