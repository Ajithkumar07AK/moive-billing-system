import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useParallax(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Layer 1: Background image (slowest)
      gsap.to('.parallax-layer-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Layer 2: Cosmic particles
      gsap.to('.parallax-layer-particles', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Layer 3: Infinity ring (rotates and scales on scroll)
      gsap.to('.parallax-layer-ring', {
        rotation: 45,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Layer 4: Crows (move horizontally across on scroll)
      gsap.to('.parallax-layer-crows', {
        xPercent: 120,
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Layer 5: Foreground tree branches (fastest)
      gsap.to('.parallax-layer-foreground', {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [options]);

  return containerRef;
}
