import React, { useState, useEffect } from 'react';
import HeroArtwork from './HeroArtwork';

/**
 * ImageWithFallback & Copyright-Free Artwork Engine
 * Renders custom 100% legal procedural vector & holographic character artworks for all 75 cards.
 * Zero copyright claims, zero broken links, instant offline loading on any projector!
 */
export default function ImageWithFallback({ card, className = "", alt = "" }) {
  if (!card) return null;

  // We render the dedicated copyright-free procedural vector artwork!
  return (
    <HeroArtwork card={card} className={className} />
  );
}
