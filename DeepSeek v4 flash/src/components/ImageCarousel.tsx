import { useState, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Theme } from '../utils/theme';
import type { ProductImage } from '../types';

interface ImageCarouselProps {
  images: ProductImage[];
  language: string;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const CarouselRegion = styled.div<{ $dir: 'ltr' | 'rtl' }>`
  position: relative;
  width: 100%;
  direction: ${({ $dir }) => $dir};
  outline: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const MainImageArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 12px;
  overflow: hidden;
`;

const ImageContainer = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity ${({ theme }) => theme.transitions.base};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.neutral[400]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Spinner = styled.span`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top-color: ${({ theme }) => theme.colors.emeraldGreen};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const navButtonPosition = {
  next: css`
    inset-inline-end: ${({ theme }) => theme.spacing.sm};
  `,
  prev: css`
    inset-inline-start: ${({ theme }) => theme.spacing.sm};
  `,
};

const NavButton = styled.button<{ $isNext: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $isNext }) => ($isNext ? navButtonPosition.next : navButtonPosition.prev)}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  z-index: 2;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const ArrowSvg = styled.svg<{ $flip: boolean }>`
  width: 20px;
  height: 20px;
  transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'scaleX(1)')};
  fill: none;
  stroke: ${({ theme }) => theme.colors.neutral[700]};
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const Thumbnail = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.emeraldGreen : theme.colors.neutral[200]};
  padding: 0;
  background: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ $active, theme }) =>
      $active ? theme.colors.emeraldGreen : theme.colors.neutral[400]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

export default function ImageCarousel({ images, language }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const isRTL = language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isRTL) goToNext();
        else goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isRTL) goToPrev();
        else goToNext();
      }
    },
    [isRTL, goToPrev, goToNext]
  );

  if (images.length === 0) {
    return (
      <CarouselRegion
        role="region"
        aria-label={isRTL ? 'معرض الصور' : 'Image carousel'}
        $dir={direction}
      >
        <MainImageArea>
          <Placeholder>
            {isRTL ? 'لا توجد صور' : 'No images available'}
          </Placeholder>
        </MainImageArea>
      </CarouselRegion>
    );
  }

  return (
    <CarouselRegion
      role="region"
      aria-label={isRTL ? 'معرض الصور' : 'Image carousel'}
      $dir={direction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <MainImageArea>
        {images.map((image, index) => (
          <ImageContainer key={index} $active={index === activeIndex}>
            {!loadedImages.has(index) && (
              <Placeholder>
                <Spinner />
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </Placeholder>
            )}
            <StyledImage
              src={image.url}
              alt={isRTL ? image.altAr : image.alt}
              onLoad={() => handleImageLoad(index)}
              draggable={false}
            />
          </ImageContainer>
        ))}
      </MainImageArea>

      <NavButton
        $isNext={false}
        onClick={goToPrev}
        aria-label={isRTL ? 'الصورة السابقة' : 'Previous image'}
      >
        <ArrowSvg viewBox="0 0 24 24" $flip={isRTL}>
          <polyline points="15 18 9 12 15 6" />
        </ArrowSvg>
      </NavButton>

      <NavButton
        $isNext={true}
        onClick={goToNext}
        aria-label={isRTL ? 'الصورة التالية' : 'Next image'}
      >
        <ArrowSvg viewBox="0 0 24 24" $flip={!isRTL}>
          <polyline points="15 18 9 12 15 6" />
        </ArrowSvg>
      </NavButton>

      {images.length > 1 && (
        <ThumbnailStrip>
          {images.map((image, index) => (
            <Thumbnail
              key={index}
              $active={index === activeIndex}
              onClick={() => goTo(index)}
              aria-label={
                isRTL ? `الصورة ${index + 1}` : `Image ${index + 1}`
              }
            >
              <ThumbnailImage src={image.url} alt="" />
            </Thumbnail>
          ))}
        </ThumbnailStrip>
      )}
    </CarouselRegion>
  );
}
