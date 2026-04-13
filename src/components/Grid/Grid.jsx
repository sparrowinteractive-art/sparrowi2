"use client";

import { forwardRef } from "react";

/**
 * Grid — site-wide 12-column responsive grid container.
 * Keeps horizontal rhythm consistent across every section of the site.
 *
 * Usage:
 *   <Grid>
 *     <GridItem span={6}>left</GridItem>
 *     <GridItem span={6}>right</GridItem>
 *   </Grid>
 *
 * `span` accepts a number (desktop width, auto-scales down on smaller
 * breakpoints) or an object { base, md, lg } for per-breakpoint control.
 */

// Lookup maps so Tailwind JIT sees every class as a literal string.
const SPAN = {
  1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4",
  5: "col-span-5", 6: "col-span-6", 7: "col-span-7", 8: "col-span-8",
  9: "col-span-9", 10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
};
const SPAN_MD = {
  1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4",
  5: "md:col-span-5", 6: "md:col-span-6", 7: "md:col-span-7", 8: "md:col-span-8",
};
const SPAN_LG = {
  1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4",
  5: "lg:col-span-5", 6: "lg:col-span-6", 7: "lg:col-span-7", 8: "lg:col-span-8",
  9: "lg:col-span-9", 10: "lg:col-span-10", 11: "lg:col-span-11", 12: "lg:col-span-12",
};
const START = {
  1: "col-start-1", 2: "col-start-2", 3: "col-start-3", 4: "col-start-4",
  5: "col-start-5", 6: "col-start-6", 7: "col-start-7", 8: "col-start-8",
  9: "col-start-9", 10: "col-start-10", 11: "col-start-11", 12: "col-start-12",
};
const START_MD = {
  1: "md:col-start-1", 2: "md:col-start-2", 3: "md:col-start-3", 4: "md:col-start-4",
  5: "md:col-start-5", 6: "md:col-start-6", 7: "md:col-start-7", 8: "md:col-start-8",
};
const START_LG = {
  1: "lg:col-start-1", 2: "lg:col-start-2", 3: "lg:col-start-3", 4: "lg:col-start-4",
  5: "lg:col-start-5", 6: "lg:col-start-6", 7: "lg:col-start-7", 8: "lg:col-start-8",
  9: "lg:col-start-9", 10: "lg:col-start-10", 11: "lg:col-start-11", 12: "lg:col-start-12",
};

/**
 * variant:
 *  - "page"  (default): outer page container — centers, max-width, gutters
 *  - "inner":           nested grid inside a GridItem — no width/padding
 *  - "fluid":           full-bleed, no max-width, no padding (for hero/video bleeds)
 */
export const Grid = forwardRef(function Grid(
  {
    as: Tag = "div",
    gap = "gap-x-6 gap-y-8",
    variant = "page",
    className = "",
    children,
    ...rest
  },
  ref
) {
  const base = "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12";
  const wrap =
    variant === "page"
      ? "w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12"
      : variant === "fluid"
      ? "w-full"
      : "w-full"; // inner

  return (
    <Tag ref={ref} className={`${base} ${gap} ${wrap} ${className}`} {...rest}>
      {children}
    </Tag>
  );
});

export const GridItem = forwardRef(function GridItem(
  { as: Tag = "div", span = 12, start, className = "", children, ...rest },
  ref
) {
  const spanClasses = buildSpan(span);
  const startClasses = start != null ? buildStart(start) : "";

  return (
    <Tag
      ref={ref}
      className={`${spanClasses} ${startClasses} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
});

function buildSpan(span) {
  if (typeof span === "number") {
    // Scale: desktop = requested, tablet = min(span, 8), mobile = 4 (full)
    const mdSpan = Math.min(Math.max(span, 1), 8);
    const lgSpan = Math.min(Math.max(span, 1), 12);
    return `${SPAN[4]} ${SPAN_MD[mdSpan]} ${SPAN_LG[lgSpan]}`;
  }
  const { base = 4, md, lg } = span;
  const parts = [SPAN[base]];
  if (md && SPAN_MD[md]) parts.push(SPAN_MD[md]);
  if (lg && SPAN_LG[lg]) parts.push(SPAN_LG[lg]);
  return parts.join(" ");
}

function buildStart(start) {
  if (typeof start === "number") {
    return START_LG[start] ? START_LG[Math.min(start, 12)] : "";
  }
  const { base, md, lg } = start;
  const parts = [];
  if (base && START[base]) parts.push(START[base]);
  if (md && START_MD[md]) parts.push(START_MD[md]);
  if (lg && START_LG[lg]) parts.push(START_LG[lg]);
  return parts.join(" ");
}

const _default = Grid;
export default _default;
