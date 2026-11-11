import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface BranchImageCarouselProps {
  images?: string[];
  city: string;
}

const BranchImageCarousel = ({
  images = [],
  city,
}: BranchImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [portraitImages, setPortraitImages] = useState<Record<number, boolean>>(
    {},
  );

  const currentImage = images[currentIndex];
  const isPortrait = portraitImages[currentIndex] ?? false;

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) {
    return (
      <div className="h-56 flex items-center justify-center bg-primary/10">
        <MapPin className="h-10 w-10 text-primary/60" />
      </div>
    );
  }

  return (
    <div className="relative h-56 w-full overflow-hidden group bg-gray-200">
      <img
        key={`${currentIndex}-${currentImage}`}
        src={currentImage}
        alt={`${city} Branch ${currentIndex + 1}`}
        onLoad={(e) => {
          const img = e.currentTarget;

          setPortraitImages((prev) => ({
            ...prev,
            [currentIndex]: img.naturalHeight > img.naturalWidth,
          }));
        }}
        className={`w-full h-full transition-transform duration-500 ${
          isPortrait ? "object-contain" : "object-cover group-hover:scale-105"
        }`}
      />

      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevImage}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2
              bg-black/50 hover:bg-black/75 text-white
              rounded-full p-2 opacity-0 group-hover:opacity-100
              transition-opacity"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2
              bg-black/50 hover:bg-black/75 text-white
              rounded-full p-2 opacity-0 group-hover:opacity-100
              transition-opacity"
          >
            <ChevronRight size={22} />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index ? "w-6 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BranchImageCarousel;
