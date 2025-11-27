import { useCallback, useEffect } from "react";

type UseKeyboardNavigationOptions = {
  isActive: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export const useKeyboardNavigation = ({
  isActive,
  onClose,
  onPrev,
  onNext,
}: UseKeyboardNavigationOptions): void => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, handleKeyDown]);
};

