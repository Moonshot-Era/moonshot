'use client';

import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';
import { Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';

export const SlideButton = () => {
  const [initialMouse, setInitialMouse] = useState(0);
  const [slideMovementTotal, setSlideMovementTotal] = useState(0);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseDown = (event: ReactMouseEvent | ReactTouchEvent) => {
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

  const handleMouseUp = (
    event: globalThis.MouseEvent | globalThis.TouchEvent
  ) => {
    if (!mouseIsDown) return;
    setMouseIsDown(false);
    const currentMouse =
      (event as globalThis.MouseEvent).clientX ||
      (event as globalThis.TouchEvent).changedTouches[0].pageX;
    const relativeMouse = currentMouse - initialMouse;
    const slider = sliderRef.current;
    const text = textRef.current;

    if (slider && text) {
      if (relativeMouse < slideMovementTotal) {
        text.style.opacity = '1';
        slider.style.left = '-10px';
        return;
      }
      slider.classList.add('unlocked');

      setTimeout(() => {
        slider.onclick = () => {
          if (!slider.classList.contains('unlocked')) return;
          slider.classList.remove('unlocked');
          slider.onclick = null;
        };
      }, 0);
    }
  };

  const handleMouseMove = (
    event: globalThis.MouseEvent | globalThis.TouchEvent
  ) => {
    if (!mouseIsDown) return;
    const currentMouse =
      (event as globalThis.MouseEvent).clientX ||
      (event as globalThis.TouchEvent).touches[0].pageX;
    const relativeMouse = currentMouse - initialMouse;
    const slidePercent = 1 - relativeMouse / slideMovementTotal;
    const slider = sliderRef.current;
    const text = textRef.current;

    if (slider && text) {
      text.style.opacity = slidePercent.toString();

      if (relativeMouse <= 0) {
        slider.style.left = '-10px';
        return;
      }
      if (relativeMouse >= slideMovementTotal + 10) {
        slider.style.left = `${slideMovementTotal}px`;
        return;
      }
      slider.style.left = `${relativeMouse - 10}px`;
    }
  };

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
  }, [mouseIsDown, initialMouse, slideMovementTotal]);

  return (
    <div id="button-slider-container" ref={backgroundRef}>
      <Text className="button-slide-text" ref={textRef} size="2">
        Swipe to confirm
      </Text>
      <div
        id="button-slider"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <Icon icon="arrowRight2" />
      </div>
    </div>
  );
};
