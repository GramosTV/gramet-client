'use client';
import React, { useRef, useState, useEffect } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useAutoplay } from './EmblaCarouselAutoplay';
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons';
import Image from 'next/image';

const EmblaCarousel: React.FC = () => {
  const options: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 5;
  const slides = Array.from(Array(SLIDE_COUNT).keys());

  const progressNode = useRef<any>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 4000, stopOnInteraction: false }),
  ]);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } = useAutoplay(emblaApi);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="embla">
      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={() => onAutoplayButtonClick(onPrevButtonClick)} disabled={prevBtnDisabled} />
          <NextButton onClick={() => onAutoplayButtonClick(onNextButtonClick)} disabled={nextBtnDisabled} />
        </div>
      </div>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <Image src={`/images/carousel/${index + 1}.jpg`} fill={true} alt="Picture of the author" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4 embla__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`embla__dot w-2 h-2 mx-1 rounded-full ${
              index === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmblaCarousel;
