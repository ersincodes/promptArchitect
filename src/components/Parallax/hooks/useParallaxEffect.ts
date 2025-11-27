import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PARALLAX_CONFIG } from "../constants";

gsap.registerPlugin(ScrollTrigger);

type UseParallaxEffectOptions = {
  isActive: boolean;
};

type UseParallaxEffectReturn = {
  sceneRef: React.MutableRefObject<HTMLDivElement | null>;
  layerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  floatingRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

export const useParallaxEffect = ({
  isActive,
}: UseParallaxEffectOptions): UseParallaxEffectReturn => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!isActive) {
      return;
    }

    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    const context = gsap.context(() => {
      // Scroll-based parallax for layers
      layerRefs.current.forEach((layer) => {
        if (!layer) {
          return;
        }

        const depth = Number(layer.dataset.depth ?? 0.2);

        gsap.fromTo(
          layer,
          {
            yPercent: depth * PARALLAX_CONFIG.scrollDepthStart,
            opacity: 0.4,
          },
          {
            yPercent: depth * PARALLAX_CONFIG.scrollDepthEnd,
            xPercent: depth * PARALLAX_CONFIG.scrollXOffset,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Floating animation for chips
      floatingRefs.current.forEach((chip, index) => {
        if (!chip) {
          return;
        }

        const isEven = index % 2 === 0;

        gsap.to(chip, {
          y: isEven ? 12 : -14,
          x: isEven ? -6 : 8,
          rotation: isEven ? 4 : -4,
          duration: 3.5 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, scene);

    // Pointer-based 3D tilt effect
    const handlePointerMove = (event: PointerEvent) => {
      if (!sceneRef.current) {
        return;
      }

      const bounds = sceneRef.current.getBoundingClientRect();
      const xDelta = (event.clientX - bounds.left) / bounds.width - 0.5;
      const yDelta = (event.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(sceneRef.current, {
        rotationY: xDelta * -PARALLAX_CONFIG.rotationMultiplier,
        rotationX: yDelta * PARALLAX_CONFIG.rotationMultiplier,
        transformPerspective: PARALLAX_CONFIG.perspective,
        duration: 0.8,
        ease: "power3.out",
      });

      layerRefs.current.forEach((layer) => {
        if (!layer) {
          return;
        }

        const depth = Number(layer.dataset.depth ?? 0.2);
        gsap.to(layer, {
          xPercent: depth * xDelta * PARALLAX_CONFIG.depthMultiplier,
          duration: 0.7,
          ease: "expo.out",
        });
      });
    };

    scene.addEventListener("pointermove", handlePointerMove);

    return () => {
      scene.removeEventListener("pointermove", handlePointerMove);
      context.revert();
    };
  }, [isActive]);

  return {
    sceneRef,
    layerRefs,
    floatingRefs,
  };
};

