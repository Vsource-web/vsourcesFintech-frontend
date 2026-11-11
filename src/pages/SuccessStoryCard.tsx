import React, { memo, useCallback, useRef, useState } from "react";
import { useLoadOnApproach } from "./useLoadOnApproach";
import {
  SUCCESS_STORY_FALLBACK_ASPECT_RATIO,
  SuccessStory,
} from "./successStoriesData";

interface SuccessStoryCardProps {
  story: SuccessStory;
  priority: boolean;
}

const LOAD_MARGIN = "1000px 0px";
const LOAD_DELAY_MS = 120;

const measuredAspectRatios = new Map<string, number>();

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({
  story,
  priority,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<number>(
    () =>
      measuredAspectRatios.get(story.src) ??
      SUCCESS_STORY_FALLBACK_ASPECT_RATIO,
  );

  const shouldLoad = useLoadOnApproach(containerRef, {
    rootMargin: LOAD_MARGIN,
    delayMs: LOAD_DELAY_MS,
    initiallyLoaded: priority,
  });

  const commitLoaded = useCallback(
    (image: HTMLImageElement) => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        const measured = image.naturalWidth / image.naturalHeight;
        measuredAspectRatios.set(story.src, measured);
        setAspectRatio(measured);
      }
      setIsLoaded(true);
    },
    [story.src],
  );

  const handleFailed = useCallback(() => setHasFailed(true), []);

  const attachImage = useCallback(
    (image: HTMLImageElement | null) => {
      if (!image || !image.complete) {
        return;
      }

      if (image.naturalWidth > 0) {
        commitLoaded(image);
      } else {
        handleFailed();
      }
    },
    [commitLoaded, handleFailed],
  );

  return (
    <div
      ref={containerRef}
      style={{ aspectRatio }}
      className={`relative w-full max-w-[300px] overflow-hidden rounded-lg bg-gray-200 shadow-md transition-shadow duration-300 hover:shadow-xl ${
        hasFailed ? "hidden" : ""
      }`}
    >
      {shouldLoad && (
        <img
          ref={attachImage}
          src={story.src}
          alt={story.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={(event) => commitLoaded(event.currentTarget)}
          onError={handleFailed}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default memo(SuccessStoryCard);
