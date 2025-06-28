/**
 * Mobile Image Debug Component
 * Helps identify and fix mobile image loading issues
 */

"use client";

import { useEffect, useState } from 'react';

export function MobileImageDebug() {
  const [isMobile, setIsMobile] = useState(false);
  const [images, setImages] = useState<{ src: string, loaded: boolean, error: boolean }[]>([]);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Monitor all images on the page
    const monitorImages = () => {
      const allImages = document.querySelectorAll('img');
      const imageData = Array.from(allImages).map(img => ({
        src: img.src,
        loaded: img.complete && img.naturalHeight !== 0,
        error: img.naturalHeight === 0 && img.complete
      }));
      setImages(imageData);
    };

    // Initial check
    monitorImages();

    // Monitor for new images
    const observer = new MutationObserver(monitorImages);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['src'] 
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  // Only show debug info in development and on mobile
  if (process.env.NODE_ENV !== 'development' || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Mobile Image Debug</div>
      <div>Total images: {images.length}</div>
      <div>Loaded: {images.filter(img => img.loaded).length}</div>
      <div>Failed: {images.filter(img => img.error).length}</div>
      <div className="mt-2 max-h-32 overflow-y-auto">
        {images.filter(img => img.error).map((img, idx) => (
          <div key={idx} className="text-red-300 text-xs truncate">
            Failed: {img.src.split('/').pop()}
          </div>
        ))}
      </div>
    </div>
  );
}
