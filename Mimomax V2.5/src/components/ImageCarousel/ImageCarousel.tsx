import styled from 'styled-components';
import { useState, useCallback, useEffect } from 'react';
import { ProductImage } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ImageCarouselProps {
  images: ProductImage[];
}

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform ${({ theme }) => theme.transitions.base};
`;

const NavButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ direction }) => (direction === 'left' ? 'left: 16px' : 'right: 16px')};
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 10;

  &:hover {
    background-color: ${({ theme }) => theme.colors.emeraldGreen};
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  justify-content: center;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 2px;
  }
`;

const Thumbnail = styled.button<{ isActive: boolean }>`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 2px solid ${({ isActive, theme }) =>
    isActive ? theme.colors.emeraldGreen : theme.colors.gray200};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  padding: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
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
`;

export const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();

  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrevious, goToNext]);

  if (images.length === 0) {
    return null;
  }

  const imageAlt = language === 'ar' ? currentImage?.altAr : currentImage?.alt;

  return (
    <CarouselContainer role="region" aria-label="Product images">
      <MainImageContainer>
        <MainImage
          src={currentImage?.url}
          alt={imageAlt || 'Product image'}
        />
        {images.length > 1 && (
          <>
            <NavButton direction="left" onClick={goToPrevious} aria-label="Previous image">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </NavButton>
            <NavButton direction="right" onClick={goToNext} aria-label="Next image">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </NavButton>
          </>
        )}
      </MainImageContainer>
      {images.length > 1 && (
        <ThumbnailStrip>
          {images.map((image, index) => {
            const thumbAlt = language === 'ar' ? image.altAr : image.alt;
            return (
              <Thumbnail
                key={index}
                isActive={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <ThumbnailImage src={image.url} alt={thumbAlt || `Thumbnail ${index + 1}`} />
              </Thumbnail>
            );
          })}
        </ThumbnailStrip>
      )}
    </CarouselContainer>
  );
};
