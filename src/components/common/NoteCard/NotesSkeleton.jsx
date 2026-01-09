import React from "react";
import { GridSkeleton } from "../Skeleton";

/**
 * Skeleton loader for notes grid
 * Uses the reusable GridSkeleton component
 */
export default function NotesSkeleton({ count = 8 }) {
  return <GridSkeleton count={count} columns={4} />;
}
