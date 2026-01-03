'use client';

/**
 * SkipToContent Component
 * Provides keyboard navigation to skip to main content (accessibility)
 */

import { useRef, useEffect } from 'react';

interface SkipToContentProps {
  targetId?: string; // ID of the main content element
  label?: string;
}

export function SkipToContent({ targetId = 'main-content', label = 'Skip to main content' }: SkipToContentProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleFocus = () => {
      // Ensure link is visible when focused
      if (linkRef.current) {
        linkRef.current.style.display = 'block';
      }
    };

    const handleBlur = () => {
      // Hide link when not focused (optional - can keep visible)
      // For better UX, we'll keep it visible but can be styled
    };

    const link = linkRef.current;
    if (link) {
      link.addEventListener('focus', handleFocus);
      link.addEventListener('blur', handleBlur);
    }

    return () => {
      if (link) {
        link.removeEventListener('focus', handleFocus);
        link.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      ref={linkRef}
      href={`#${targetId}`}
      onClick={handleClick}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        focus:z-max focus:px-4 focus:py-2 focus:bg-accent-blue
        focus:text-white focus:rounded-medium focus:shadow-level-4
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue
      `}
    >
      {label}
    </a>
  );
}

