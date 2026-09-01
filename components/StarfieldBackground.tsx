"use client";

import { useEffect, useRef } from "react";

interface Star {
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  alpha: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    const numStars = 6000; // Doubled the number of stars
    let width = window.innerWidth;
    let height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let scrollY = window.scrollY;

    const MAX_DEPTH = 2000;
    const FOV = width; // Field of view

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          // Base X and Y are relative to center (0,0) before projection
          baseX: (Math.random() - 0.5) * width * 4, 
          baseY: (Math.random() - 0.5) * height * 4,
          baseZ: Math.random() * MAX_DEPTH,
          radius: Math.random() * 2.0 + 1.0, // Increased base radius for bigger stars
          alpha: Math.random(),
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    window.addEventListener("resize", resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      
      stars.forEach((star) => {
        // Z translation based on scroll position!
        let currentZ = star.baseZ - (scrollY * 1.5);
        
        // Wrap around seamlessly in 3D space
        currentZ = ((currentZ % MAX_DEPTH) + MAX_DEPTH) % MAX_DEPTH;
        
        if (currentZ < 1) currentZ = 1;

        const scale = FOV / currentZ;
        const screenX = cx + (star.baseX * scale);
        const screenY = cy + (star.baseY * scale);
        const projectedRadius = Math.max(0.1, star.radius * scale);

        if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return;

        const dx = mouseX - screenX;
        const dy = mouseY - screenY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let evadeX = 0;
        let evadeY = 0;
        if (dist < 150) {
          const force = (150 - dist) / 150;
          evadeX = -(dx / dist) * force * 20;
          evadeY = -(dy / dist) * force * 20;
        }

        // Depth-based fading - use a gentler curve so stars shine brighter
        let depthAlpha = 1 - (currentZ / MAX_DEPTH);
        depthAlpha = Math.pow(depthAlpha, 0.5); // Boosts brightness of distant stars
        
        star.alpha += (Math.random() - 0.5) * 0.08;
        if (star.alpha < 0.3) star.alpha = 0.3; // Raised minimum alpha for more shine
        if (star.alpha > 1) star.alpha = 1;
        
        const finalAlpha = Math.min(1, Math.max(0, depthAlpha * star.alpha * 1.8));
        
        // Add a beautiful glowing shadow effect!
        ctx.shadowBlur = projectedRadius * 4;
        ctx.shadowColor = `rgba(255, 255, 255, ${finalAlpha * 0.8})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        
        const x = screenX + evadeX;
        const y = screenY + evadeY;
        const r = projectedRadius * 2.0; // Visually bigger sparkles

        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.quadraticCurveTo(x, y, x, y + r);
        ctx.quadraticCurveTo(x, y, x - r, y);
        ctx.quadraticCurveTo(x, y, x, y - r);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-50] bg-black"
    />
  );
}
