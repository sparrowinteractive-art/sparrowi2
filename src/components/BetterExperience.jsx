"use client";

import React, { useEffect } from "react";
import { Grid, GridItem } from "./Grid";
import "../styles/BetterExperience.css";

const DEFAULT_TEXT = (
  <>
    There&rsquo;s Always<br />
    Room for a Better<br />
    Experience.
  </>
);

export default function BetterExperience({ text = DEFAULT_TEXT }) {
  // Sync the section's transparent tail height to the actual rendered height
  // of .footer_back so the panel scrolls up by exactly enough to reveal the
  // entire footer behind it. Re-measures on resize.
  useEffect(() => {
    const fb = document.querySelector(".footer_back");
    if (!fb) return;
    const apply = () => {
      const h = fb.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--footer-back-h",
        `${Math.ceil(h)}px`
      );
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(fb);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);



  return (
    <section className="section-experience" data-navbar-theme="dark">
      <div className="section-experience__panel">
        <Grid>
          <GridItem span={{ base: 4, md: 8, lg: 10 }}>
            <h2 className="section-experience__text">{text}</h2>
          </GridItem>
        </Grid>
      </div>
    </section>
  );
}
