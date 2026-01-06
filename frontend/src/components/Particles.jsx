// src/components/Particles.jsx

import React, { useEffect, useRef } from 'react';

const Particles = ({
  count = 100,              // quantidade de partículas
  speed = 1.5,              // velocidade base (multiplicador)
  colors = ['#ff4000', '#ff8c00', '#ffbf00'], // cores do tema EDDA 
  sizeMin = 2,
  sizeMax = 6,
  opacityMin = 0.3,
  opacityMax = 0.8,
  glowIntensity = 30,       // intensidade do brilho
  zIndex = -1               
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configura canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cria partículas
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 1.5 - canvas.height, // começa fora da tela
      size: Math.random() * (sizeMax - sizeMin) + sizeMin,
      speedY: -(Math.random() * 1.5 + 0.5) * speed,
      speedX: (Math.random() - 0.5) * 0.8, // leve movimento lateral
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * (opacityMax - opacityMin) + opacityMin
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Movimento
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5; // onda suave

        // Respawn na parte inferior
        if (p.y < -50) {
          p.y = canvas.height + 50;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [count, speed, colors, sizeMin, sizeMax, opacityMin, opacityMax, glowIntensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    />
  );
};

export default Particles;