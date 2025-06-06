import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselSlide {
  id: string | number;
  content: React.ReactNode; // Can be complex JSX
  imageUrl?: string; // Optional image URL for background
  altText?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  options?: Parameters<typeof useEmblaCarousel>[0];
  autoplayDelay?: number;
}

const Carousel: React.FC<CarouselProps> = ({ slides, options, autoplayDelay = 4000 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, ...options },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
  );

  console.log("Rendering Carousel with", slides.length, "slides.");

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!slides || slides.length === 0) {
    return <div className="text-center p-4">No items to display in carousel.</div>;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div className="embla__slide flex-[0_0_100%] min-w-0" key={slide.id}>
              <Card className="m-1 md:m-2 shadow-none border-none bg-transparent"> {/* Adjust styling as needed */}
                <CardContent className="flex aspect-[16/7] md:aspect-[16/5] items-center justify-center p-2 md:p-6 relative overflow-hidden rounded-lg">
                  {slide.imageUrl && (
                    <img
                      src={slide.imageUrl}
                      alt={slide.altText || `Slide ${slide.id}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="relative z-10 text-white bg-black bg-opacity-30 p-4 rounded"> {/* Ensure content is visible over image */}
                    {slide.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-8 w-8 sm:h-10 sm:w-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-8 w-8 sm:h-10 sm:w-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </>
      )}
    </div>
  );
};
export default Carousel;