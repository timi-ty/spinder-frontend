import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface OrbBackdropProps {
  className?: string;
  opacity?: number;
  enableGlitch?: boolean;
  enabled?: boolean;
}

const ASCII_DENSITY = " .:-=+*#%@";

export default function OrbBackdrop({
  className = "",
  opacity = 1,
  enableGlitch = true,
  enabled = true,
}: OrbBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const paramsRef = useRef({
    rotation: 0,
    atmosphereShift: 0,
    glitchIntensity: 0,
    glitchFrequency: 0,
  });
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const cvs = canvasRef.current;
    const grainCvs = grainCanvasRef.current;
    if (!cvs || !grainCvs) return;

    const mainCtx = cvs.getContext("2d");
    const grCtx = grainCvs.getContext("2d");
    if (!mainCtx || !grCtx) return;

    const canvas = cvs;
    const grainCanvas = grainCvs;
    const ctx = mainCtx;
    const grainCtx = grCtx;
    const params = paramsRef.current;

    const t1 = gsap.to(params, {
      rotation: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    const t2 = gsap.to(params, {
      atmosphereShift: 1,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const tweens = [t1, t2];

    if (enableGlitch) {
      tweens.push(
        gsap.to(params, {
          glitchIntensity: 0.6,
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          repeatDelay: 3 + Math.random() * 4,
        }),
        gsap.to(params, {
          glitchFrequency: 1,
          duration: 0.05,
          repeat: -1,
          yoyo: true,
          ease: "none",
        })
      );
    }

    tweensRef.current = tweens;

    let lastRender = 0;
    const FRAME_INTERVAL = 1000 / 30;

    function render(timestamp: number) {
      if (timestamp - lastRender < FRAME_INTERVAL) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }
      lastRender = timestamp;

      timeRef.current += 0.033;
      const time = timeRef.current;

      const container = canvas.parentElement;
      if (!container) return;
      const width = (canvas.width = grainCanvas.width = container.clientWidth);
      const height = (canvas.height = grainCanvas.height =
        container.clientHeight);

      if (width === 0 || height === 0) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.2;
      const hue = 180 + params.atmosphereShift * 60;

      drawAtmosphere(ctx, centerX, centerY, width, height, hue);
      drawGlitchedOrb(
        ctx,
        canvas,
        centerX,
        centerY,
        radius,
        hue,
        params.glitchIntensity
      );
      drawAsciiSphere(
        ctx,
        centerX,
        centerY,
        radius,
        width,
        height,
        params.rotation,
        params.glitchIntensity
      );
      renderFilmGrain(grainCtx, width, height, time, params.glitchIntensity);

      frameRef.current = requestAnimationFrame(render);
    }

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      tweensRef.current.forEach((t) => t.kill());
      tweensRef.current = [];
    };
  }, [enabled, enableGlitch]);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <canvas
        ref={grainCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          mixBlendMode: "overlay",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

function drawAtmosphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  hue: number
) {
  const grad = ctx.createRadialGradient(cx, cy - 50, 0, cx, cy, Math.max(w, h) * 0.8);
  grad.addColorStop(0, `hsla(${hue + 40}, 80%, 60%, 0.4)`);
  grad.addColorStop(0.3, `hsla(${hue}, 60%, 40%, 0.3)`);
  grad.addColorStop(0.6, `hsla(${hue - 20}, 40%, 20%, 0.2)`);
  grad.addColorStop(1, "rgba(0, 0, 0, 0.9)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawGlitchedOrb(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  cx: number,
  cy: number,
  radius: number,
  hue: number,
  glitchIntensity: number
) {
  ctx.save();

  const shouldGlitch = Math.random() < 0.1 && glitchIntensity > 0.3;
  const glitchOffset = shouldGlitch
    ? (Math.random() - 0.5) * 20 * glitchIntensity
    : 0;

  if (shouldGlitch) {
    const scale = 1 + (Math.random() - 0.5) * 0.3 * glitchIntensity;
    ctx.translate(glitchOffset, glitchOffset * 0.8);
    ctx.scale(scale, 1 / scale);
  }

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
  grad.addColorStop(0, `hsla(${hue + 10}, 100%, 95%, 0.9)`);
  grad.addColorStop(0.2, `hsla(${hue + 20}, 90%, 80%, 0.7)`);
  grad.addColorStop(0.5, `hsla(${hue}, 70%, 50%, 0.4)`);
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerRadius = radius * 0.3;
  ctx.fillStyle = `hsla(${hue + 20}, 100%, 95%, 0.8)`;
  ctx.beginPath();
  ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
  ctx.fill();

  if (shouldGlitch) {
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = `hsla(100, 100%, 50%, ${0.6 * glitchIntensity})`;
    ctx.beginPath();
    ctx.arc(cx + glitchOffset * 0.5, cy, centerRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `hsla(240, 100%, 50%, ${0.5 * glitchIntensity})`;
    ctx.beginPath();
    ctx.arc(cx - glitchOffset * 0.5, cy, centerRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * glitchIntensity})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = cy - radius + Math.random() * radius * 2;
      ctx.beginPath();
      ctx.moveTo(cx - radius + Math.random() * 20, y);
      ctx.lineTo(cx + radius - Math.random() * 20, y);
      ctx.stroke();
    }

    ctx.fillStyle = `rgba(255, 0, 255, ${0.4 * glitchIntensity})`;
    for (let i = 0; i < 3; i++) {
      const bx = cx - radius + Math.random() * radius * 2;
      const by = cy - radius + Math.random() * radius * 2;
      ctx.fillRect(bx, by, Math.random() * 10 + 2, Math.random() * 10 + 2);
    }
  }

  ctx.strokeStyle = `hsla(${hue + 20}, 80%, 70%, 0.6)`;
  ctx.lineWidth = 2;

  if (shouldGlitch) {
    for (let i = 0; i < 8; i++) {
      const start = (i / 8) * Math.PI * 2;
      const end = ((i + 1) / 8) * Math.PI * 2;
      const r = radius * 1.2 + (Math.random() - 0.5) * 10 * glitchIntensity;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, end);
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (shouldGlitch && Math.random() < 0.3) {
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * glitchIntensity})`;
    for (let i = 0; i < 3; i++) {
      const barY = cy - radius + Math.random() * radius * 2;
      ctx.fillRect(cx - radius, barY, radius * 2, Math.random() * 5 + 1);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.restore();
}

function drawAsciiSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  width: number,
  height: number,
  rotation: number,
  glitchIntensity: number
) {
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const spacing = 9;
  const cols = Math.min(Math.floor(width / spacing), 150);
  const rows = Math.min(Math.floor(height / spacing), 100);
  const glitchChars = ["\u2588", "\u2593", "\u2592", "\u2591", "\u2584", "\u2580", "\u25A0", "\u25A1"];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i - cols / 2) * spacing + cx;
      const y = (j - rows / 2) * spacing + cy;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius && Math.random() > 0.4) {
        const z = Math.sqrt(Math.max(0, radius * radius - dx * dx - dy * dy));
        const rotZ = dx * Math.sin(rotation) + z * Math.cos(rotation);
        const brightness = (rotZ + radius) / (radius * 2);

        if (rotZ > -radius * 0.3) {
          let char =
            ASCII_DENSITY[Math.floor(brightness * (ASCII_DENSITY.length - 1))];

          if (
            dist < radius * 0.8 &&
            glitchIntensity > 0.5 &&
            Math.random() < 0.3
          ) {
            char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.2, brightness)})`;
          ctx.fillText(char, x, y);
        }
      }
    }
  }
}

function renderFilmGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  glitchIntensity: number
) {
  ctx.clearRect(0, 0, width, height);

  const intensity = 0.22 + Math.sin(time * 10) * 0.03;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * intensity * 255;
    const v = Math.max(0, Math.min(255, 128 + grain));
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = Math.abs(grain) * 3;
  }

  ctx.putImageData(imageData, 0, 0);

  if (glitchIntensity > 0.3) {
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 200; i++) {
      const gx = Math.random() * width;
      const gy = Math.random() * height;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 * glitchIntensity})`;
      ctx.beginPath();
      ctx.arc(gx, gy, Math.random() * 3 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 2 + 0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalCompositeOperation = "multiply";
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.5 + 0.5})`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 1.5 + 0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}
