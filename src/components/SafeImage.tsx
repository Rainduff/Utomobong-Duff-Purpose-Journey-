import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export default function SafeImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200/80 text-zinc-500 p-6 text-center select-none"
      >
        <ImageOff className="w-6 h-6 text-zinc-400 mb-2" />
        <span className="text-xs font-semibold text-zinc-700">
          {fallbackTitle || alt}
        </span>
        <span className="text-[11px] font-mono text-zinc-400 mt-0.5">
          Preview unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setHasError(true)}
      className={`${className} transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
