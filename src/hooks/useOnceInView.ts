import { useCallback, useEffect, useState } from "react";

export interface UseOnceInViewOptions {
  rootMargin?: string;
  threshold?: number;
  eager?: boolean;
}

export interface UseOnceInViewResult<T extends Element> {
  ref: (node: T | null) => void;
  hasEntered: boolean;
}

export function useOnceInView<T extends Element = HTMLDivElement>({
  rootMargin = "300px 0px",
  threshold = 0,
  eager = false,
}: UseOnceInViewOptions = {}): UseOnceInViewResult<T> {
  const [node, setNode] = useState<T | null>(null);
  const [entered, setEntered] = useState<boolean>(false);

  const ref = useCallback((element: T | null) => {
    setNode(element);
  }, []);

  const shouldObserve = !eager && !entered && node !== null;

  useEffect(() => {
    if (!shouldObserve || !node) return;

    if (typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const reached = entries.some((entry) => {
          if (entry.isIntersecting) return true;
          const rootTop = entry.rootBounds ? entry.rootBounds.top : 0;
          return entry.boundingClientRect.bottom <= rootTop;
        });

        if (reached) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [shouldObserve, node, rootMargin, threshold]);

  return { ref, hasEntered: eager || entered };
}

export default useOnceInView;
