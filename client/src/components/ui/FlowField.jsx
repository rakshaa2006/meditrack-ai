import { useEffect, useRef } from 'react';

export default function FlowField({
  color        = '#6366f1',
  trailOpacity = 0.12,
  particleCount = 600,
  speed        = 0.9,
}) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W      = container.clientWidth;
    let H      = container.clientHeight;
    let mouse  = { x: -1000, y: -1000 };
    let animId;
    let particles = [];

    class Particle {
      constructor(rand = true) { this.reset(rand); }
      reset(rand) {
        this.x    = Math.random() * W;
        this.y    = rand ? Math.random() * H : (Math.random() < 0.5 ? 0 : H);
        this.vx   = 0;
        this.vy   = 0;
        this.age  = 0;
        this.life = Math.random() * 200 + 100;
      }
      update() {
        const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
        this.vx += Math.cos(angle) * 0.2 * speed;
        this.vy += Math.sin(angle) * 0.2 * speed;
        const dx   = mouse.x - this.x;
        const dy   = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const f = (150 - dist) / 150;
          this.vx -= dx * f * 0.05;
          this.vy -= dy * f * 0.05;
        }
        this.x  += this.vx;
        this.y  += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.age++;
        if (this.age > this.life) this.reset(false);
        if (this.x < 0) this.x = W;
        if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H;
        if (this.y > H) this.y = 0;
      }
      draw() {
        const a = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle   = color;
        ctx.fillRect(this.x, this.y, 1.5, 1.5);
      }
    }

    const init = () => {
      const dpr     = window.devicePixelRatio || 1;
      W             = container.clientWidth;
      H             = container.clientHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle(true));
    };

    const animate = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle   = `rgba(0,0,0,${trailOpacity})`;
      ctx.fillRect(0, 0, W, H);
      for (const p of particles) { p.update(); p.draw(); }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };

    const onResize    = () => init();
    const onMouseMove = (e) => {
      const r   = canvas.getBoundingClientRect();
      mouse.x   = e.clientX - r.left;
      mouse.y   = e.clientY - r.top;
    };
    const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    init();
    animate();

    window.addEventListener('resize', onResize);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [color, trailOpacity, particleCount, speed]);

  return (
    <div
      ref={containerRef}
      style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'#000', overflow:'hidden' }}
    >
      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'100%' }} />
    </div>
  );
}