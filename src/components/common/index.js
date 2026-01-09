/**
 * Common Components Index
 * Central export point for all reusable components
 * 
 * Usage:
 * import { PageHeader, LoadingSpinner, ErrorState } from "@/components/common";
 */

// Layout Components
export { default as PageHeader } from "./PageHeader";
export { default as LoadingSpinner } from "./LoadingSpinner";
export { default as ErrorState } from "./ErrorState";
export { default as ItemGrid } from "./ItemGrid";
export { default as SearchBar } from "./SearchBar";

// UI Components
export { default as Button } from "./Button";
export { default as Badge } from "./Badge";
export { default as Card } from "./Card";
export { default as Input } from "./Input/Input";
export { default as Skeleton, CardSkeleton, GridSkeleton } from "./Skeleton";

// Existing NoteCard exports
export { default as NoteCard } from "./NoteCard/NoteCard";
export { default as SyllabusCard } from "./NoteCard/SyllabusCard";
export { default as EmptyState } from "./NoteCard/EmptyState";
export { default as NotesSkeleton } from "./NoteCard/NotesSkeleton";

// Blog
export { default as BlogCard } from "./Blog/BlogCard";

// Ads
export { default as AdCard } from "./Adcard/Adcard";
export { default as FloatingAds } from "./FloatingAds";
