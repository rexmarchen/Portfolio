import { RefObject, useEffect, useState } from "react";

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit = {},
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold, ref]);

  return isVisible;
}
