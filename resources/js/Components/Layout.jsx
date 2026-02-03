import React from 'react';
import MainLayout from './UI/MainLayout';

/**
 * Layout wrapper - uses MainLayout (single Sidebar source of truth).
 * Prefer using MainLayout directly in pages.
 */
export default function Layout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
