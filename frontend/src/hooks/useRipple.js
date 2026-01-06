// src/hooks/useRipple.js
import { useCallback } from 'react';

export default function useRipple() {
  const createRipple = useCallback((event) => {
    const button = event.currentTarget;

    // Remove ripples anteriores
    const existingRipples = button.getElementsByClassName('ripple');
    while (existingRipples.length > 0) {
      existingRipples[0].remove();
    }

    // Cria o novo ripple
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    button.appendChild(circle);

    // Remove automaticamente após a animação (800ms, conforme sua CSS)
    setTimeout(() => {
      circle.remove();
    }, 800);
  }, []);

  return createRipple;
}