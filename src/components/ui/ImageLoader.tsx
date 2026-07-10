import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ImageLoaderProps {
  className?: string;
  fallbackClassName?: string;
  src?: string;
  alt?: string;
  loading?: "eager" | "lazy";
  [key: string]: any;
}

export default function ImageLoader({ className, fallbackClassName, src, alt, loading = "lazy", ...props }: ImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden w-full h-full bg-gray-100 flex items-center justify-center", fallbackClassName)}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {error ? (
        <ImageIcon className="text-gray-400 opacity-30" size={32} />
      ) : (
        <img
          src={src}
          alt={alt || "Product image"}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={cn("w-full h-full transition-opacity duration-700", isLoaded ? "opacity-100" : "opacity-0", className)}
          {...props}
        />
      )}
    </div>
  );
}
