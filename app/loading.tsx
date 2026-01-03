/**
 * Next.js Loading Component
 * Displays the stunning loading screen during page transitions
 */

'use client';

import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { useState, useEffect } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingScreen 
      progress={progress} 
      message="Loading Experience..."
    />
  );
}

