'use client';

/**
 * AppLayout Component
 * Main application layout with responsive Header, Sidebar, and Main content area
 */

import React, { ReactNode, useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useIsMobile, useIsDesktop } from '@/hooks/useMediaQuery';

// ============================================================================
// Types
// ============================================================================

export interface AppLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  showSidebar?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function AppLayout({
  children,
  sidebarContent,
  showSidebar = true,
}: AppLayoutProps) {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Closed on mobile by default

  // Update sidebar state when breakpoint changes
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile, isDesktop]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-charcoal bg-gradient-dark flex flex-col">
      {/* Header */}
      <Header
        onMenuClick={handleMenuToggle}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
          >
            {sidebarContent}
          </Sidebar>
        )}

        {/* Main Content */}
        <main 
          className={`
            flex-1 overflow-hidden custom-scrollbar relative
            ${isMobile ? 'w-full' : ''}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
