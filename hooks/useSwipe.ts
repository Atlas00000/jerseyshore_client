'use client';

/**
 * useSwipe Hook
 * Detects swipe gestures (left, right, up, down)
 */

import { useRef, useState, useCallback } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeState {
  isSwiping: boolean;
  direction: SwipeDirection | null;
  distance: number;
}

interface UseSwipeOptions {
  onSwipe?: (direction: SwipeDirection, distance: number) => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  threshold?: number; // Minimum distance to trigger swipe (default: 50px)
  preventDefault?: boolean;
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    onSwipe,
    onSwipeStart,
    onSwipeEnd,
    threshold = 50,
    preventDefault = true,
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    distance: 0,
  });

  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const currentPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (preventDefault) e.preventDefault();
      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      currentPosRef.current = { x: touch.clientX, y: touch.clientY };
      setSwipeState({ isSwiping: true, direction: null, distance: 0 });
      onSwipeStart?.();
    },
    [onSwipeStart, preventDefault]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!startPosRef.current) return;
      if (preventDefault) e.preventDefault();
      const touch = e.touches[0];
      currentPosRef.current = { x: touch.clientX, y: touch.clientY };

      const deltaX = currentPosRef.current.x - startPosRef.current.x;
      const deltaY = currentPosRef.current.y - startPosRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let direction: SwipeDirection | null = null;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      setSwipeState({ isSwiping: true, direction, distance });
    },
    [preventDefault]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!startPosRef.current || !currentPosRef.current) return;
      if (preventDefault) e.preventDefault();

      const deltaX = currentPosRef.current.x - startPosRef.current.x;
      const deltaY = currentPosRef.current.y - startPosRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let direction: SwipeDirection | null = null;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (distance >= threshold && direction) {
        onSwipe?.(direction, distance);
      }

      setSwipeState({ isSwiping: false, direction: null, distance: 0 });
      startPosRef.current = null;
      currentPosRef.current = null;
      onSwipeEnd?.();
    },
    [onSwipe, onSwipeEnd, threshold, preventDefault]
  );

  return {
    swipeState,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

