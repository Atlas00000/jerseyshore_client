'use client';

/**
 * LazyLoad Component
 * Lazy loads content when it enters the viewport
 */

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Spinner } from '@/components/ui/Loading';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  placeholder?: ReactNode;
}

export function LazyLoad({
  children,
  fallback = <Spinner size="md" />,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  placeholder,
}: LazyLoadProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const { isVisible, ref } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
    onEnter: () => setShouldLoad(true),
  });

  // Load immediately if already visible
  useEffect(() => {
    if (isVisible && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isVisible, shouldLoad]);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      {shouldLoad ? (
        children
      ) : placeholder ? (
        placeholder
      ) : (
        <div className="flex items-center justify-center p-8">
          {fallback}
        </div>
      )}
    </div>
  );
}

/**
 * LazyImage Component
 * Lazy loads images with placeholder
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder,
  fallback,
  className = '',
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      if (fallback) {
        setImageSrc(fallback);
      }
      setIsLoading(false);
      setHasError(true);
    };
  }, [src, fallback]);

  return (
    <LazyLoad
      placeholder={
        <div className="w-full h-full bg-base-charcoal-gray animate-shimmer rounded-medium" />
      }
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'} ${hasError ? 'object-contain' : ''}`}
        {...props}
      />
    </LazyLoad>
  );
}

