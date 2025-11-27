import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CAROUSEL_CONFIG } from "../constants";

type UseCarouselOptions = {
  totalItems: number;
  isActive: boolean;
};

type UseCarouselReturn = {
  activeIndex: number;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  handlePrev: () => void;
  handleNext: () => void;
  handleGoTo: (index: number) => void;
};

export const useCarousel = ({
  totalItems,
  isActive,
}: UseCarouselOptions): UseCarouselReturn => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
  }, [totalItems]);

  const handleGoTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Reset to first card when carousel becomes active
  useEffect(() => {
    if (isActive) {
      setActiveIndex(0);
    }
  }, [isActive]);

  // Animate cards when active index changes
  useLayoutEffect(() => {
    if (!isActive) {
      return;
    }

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      const offset = index - activeIndex;
      const isActiveCard = offset === 0;
      const isPrev = offset === -1 || (activeIndex === 0 && index === totalItems - 1);
      const isNext = offset === 1 || (activeIndex === totalItems - 1 && index === 0);

      const getXPosition = (): number => {
        if (isActiveCard) return 0;
        if (isPrev) return CAROUSEL_CONFIG.offsetPrev;
        if (isNext) return CAROUSEL_CONFIG.offsetNext;
        return offset < 0 ? -CAROUSEL_CONFIG.offsetHidden : CAROUSEL_CONFIG.offsetHidden;
      };

      gsap.to(card, {
        x: getXPosition(),
        scale: isActiveCard ? 1 : CAROUSEL_CONFIG.scaleInactive,
        opacity: isActiveCard ? 1 : isPrev || isNext ? CAROUSEL_CONFIG.opacityAdjacent : 0,
        rotateY: isActiveCard ? 0 : isPrev ? CAROUSEL_CONFIG.rotationAngle : isNext ? -CAROUSEL_CONFIG.rotationAngle : 0,
        zIndex: isActiveCard ? 30 : isPrev || isNext ? 20 : 10,
        duration: CAROUSEL_CONFIG.animationDuration,
        ease: "power3.out",
      });
    });
  }, [isActive, activeIndex, totalItems]);

  return {
    activeIndex,
    cardRefs,
    handlePrev,
    handleNext,
    handleGoTo,
  };
};

