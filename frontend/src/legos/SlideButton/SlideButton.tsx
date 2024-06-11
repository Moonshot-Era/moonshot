"use client";

import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react';
import { Spinner, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';

export const SlideButton = forwardRef(function SlideButton(
  {
    disabled,
    handleSubmit,
    loading,
    label = 'Swipe to confirm'
  }: {
    disabled?: boolean;
    handleSubmit(): void;
    loading?: boolean;
    label?: string;
  },
  ref
) {
  const [initialMouse, setInitialMouse] = useState(0);
  const [slideMovementTotal, setSlideMovementTotal] = useState(0);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseDown = (event: ReactMouseEvent | ReactTouchEvent) => {
    if (disabled) {
      return;
    }
    setMouseIsDown(true);
    const slider = sliderRef.current;
    const background = backgroundRef.current;
    if (slider && background) {
      setSlideMovementTotal(background.offsetWidth - slider.offsetWidth + 10);
      const clientX =
        (event as ReactMouseEvent).clientX ||
        (event as ReactTouchEvent).touches[0].pageX;
      setInitialMouse(clientX);
    }
  };

  const setSliderToPosition = useCallback(
    (position: number, mouseUp?: boolean) => {
      const slider = sliderRef.current;
      const text = textRef.current;

      if (slider && text) {
        if (mouseUp) {
          if (position < slideMovementTotal) {
            text.style.opacity = '1';
            slider.style.left = '-1px';
            return;
          }
          slider.classList.add('unlocked');
        } else {
          if (position === 0) {
            text.style.opacity = '1';
            slider.style.left = '-1px';
            slider.classList.add('unlocked');
            return;
          }

          if (position >= slideMovementTotal + 1) {
            slider.style.left = `${slideMovementTotal}px`;
            return;
          }
          slider.style.left = `${position - 1}px`;
          const slidePercent = 1 - position / slideMovementTotal;
          text.style.opacity = slidePercent.toString();
        }
      }
    },
    [slideMovementTotal]
  );

  const handleMouseUp = useCallback(
    (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (!mouseIsDown) return;
      setMouseIsDown(false);
      const currentMouse =
        (event as globalThis.MouseEvent).clientX ||
        (event as globalThis.TouchEvent).changedTouches[0].pageX;
      setSliderToPosition(currentMouse, true);
      if (currentMouse >= slideMovementTotal) {
        handleSubmit();
      }

    },
    [handleSubmit, mouseIsDown, setSliderToPosition, slideMovementTotal]
  );

  const handleMouseMove = useCallback(
    (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (!mouseIsDown) return;
      const currentMouse =
        (event as globalThis.MouseEvent).clientX ||
        (event as globalThis.TouchEvent).touches[0].pageX;
      const relativeMouse = currentMouse - initialMouse;
      setSliderToPosition(relativeMouse);
    },
    [initialMouse, mouseIsDown, setSliderToPosition]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        resetSlide: () => {
          if (
            sliderRef.current &&
            sliderRef.current.classList.contains('unlocked')
          ) {
            sliderRef.current.classList.remove('unlocked');
          }
          setInitialMouse(0);
          setMouseIsDown(false);
          setSlideMovementTotal(0);
          setSliderToPosition(0);
        }
      };
    },
    [setSliderToPosition]
  );
  useEffect(() => {
    const handleMouseMoveWrapper = (event: MouseEvent) =>
      handleMouseMove(event);
    const handleMouseUpWrapper = (event: MouseEvent) => handleMouseUp(event);
    const handleTouchMoveWrapper = (event: TouchEvent) =>
      handleMouseMove(event);
    const handleTouchEndWrapper = (event: TouchEvent) => handleMouseUp(event);

    document.addEventListener('mousemove', handleMouseMoveWrapper);
    document.addEventListener('mouseup', handleMouseUpWrapper);
    document.addEventListener('touchmove', handleTouchMoveWrapper);
    document.addEventListener('touchend', handleTouchEndWrapper);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveWrapper);
      document.removeEventListener('mouseup', handleMouseUpWrapper);
      document.removeEventListener('touchmove', handleTouchMoveWrapper);
      document.removeEventListener('touchend', handleTouchEndWrapper);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      id="button-slider-container"
      className={`button-slider-container ${disabled ? 'disabled' : ''}`}
      ref={backgroundRef}
    >
      <Text
        className="button-slide-text"
        ref={textRef}
        size="2"
        weight="medium"
      >
        {label}
      </Text>
      <div
        ref={sliderRef}
        id="button-slider"
        className={`button-slider ${disabled ? 'disabled' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {loading ? (
          <Spinner size="3" />
        ) : (
          <Icon icon="arrowRight" width={36} height={36} />
        )}
      </div>
    </div>
  );
});
