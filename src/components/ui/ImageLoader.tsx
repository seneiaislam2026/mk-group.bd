import React from 'react';
export default function ImageLoader({ src, alt, className }: { src: string, alt: string, className?: string }) {
  return <img src={src} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" />;
}
