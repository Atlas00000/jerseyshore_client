'use client';

/**
 * Header Component
 * Sticky header with logo, navigation, and user actions
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================================================
// Types
// ============================================================================

export interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-sticky glass-accent border-b border-accent-cyan/30 shadow-elevation-2">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center gap-4">
            {/* Menu Button */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-base-charcoal-gray rounded-medium transition-smooth hover:glow-cyan-hover lg:hidden"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6 text-accent-cyan"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isSidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}

          </div>

          {/* Center Section - Navigation (optional, can be added later) */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {/* Navigation items can be added here */}
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Export Button */}
            <Button variant="secondary" size="sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </Button>

            {/* Save Button */}
            <Button variant="primary" size="sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save
            </Button>

            {/* User Menu (placeholder) */}
            <button
              className="p-2 hover:bg-base-charcoal-gray rounded-medium transition-smooth hover:glow-cyan-hover"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-white text-small font-medium">U</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

