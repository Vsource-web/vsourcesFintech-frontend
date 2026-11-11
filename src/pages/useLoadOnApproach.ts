import { RefObject, useEffect, useState } from "react";

type ApproachListener = (isNear: boolean) => void;

interface ObserverRegistry {
  observer: IntersectionObserver;
  listeners: Map<Element, ApproachListener>;
}

export interface LoadOnApproachOptions {
  rootMargin: string;
  delayMs: number;
  initiallyLoaded: boolean;
}

const registries = new Map<string, ObserverRegistry>();

const getRegistry = (rootMargin: string): ObserverRegistry => {
  const existing = registries.get(rootMargin);
  if (existing) {
    return existing;
  }

  const listeners = new Map<Element, ApproachListener>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        listeners.get(entry.target)?.(entry.isIntersecting);
      });
    },
    { rootMargin },
  );

  const registry: ObserverRegistry = { observer, listeners };
  registries.set(rootMargin, registry);
  return registry;
};

const observeElement = (
  element: Element,
  rootMargin: string,
  listener: ApproachListener,
): (() => void) => {
  const { observer, listeners } = getRegistry(rootMargin);
  listeners.set(element, listener);
  observer.observe(element);

  return () => {
    listeners.delete(element);
    observer.unobserve(element);
  };
};

export const useLoadOnApproach = (
  ref: RefObject<HTMLElement | null>,
  { rootMargin, delayMs, initiallyLoaded }: LoadOnApproachOptions,
): boolean => {
  const [hasTriggered, setHasTriggered] = useState<boolean>(initiallyLoaded);

  useEffect(() => {
    if (hasTriggered) {
      return undefined;
    }

    const element = ref.current;
    if (!element) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setHasTriggered(true);
      return undefined;
    }

    let timerId: number | null = null;

    const cancelPendingTrigger = () => {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    };

    const stopObserving = observeElement(element, rootMargin, (isNear) => {
      if (!isNear) {
        cancelPendingTrigger();
        return;
      }

      if (timerId !== null) {
        return;
      }

      timerId = window.setTimeout(() => {
        timerId = null;
        setHasTriggered(true);
      }, delayMs);
    });

    return () => {
      cancelPendingTrigger();
      stopObserving();
    };
  }, [ref, rootMargin, delayMs, hasTriggered]);

  return hasTriggered;
};
