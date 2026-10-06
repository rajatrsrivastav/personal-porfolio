'use client';

import React, { useEffect, useRef, useState } from "react";

/**
 * KatanaSliceCursor
 *
 * Minimalist Katana Slice / Blade Arc Trail + Deadpool Katana Cursor
 * - Custom Deadpool Katana sword replaces the OS cursor (razor tip aligns directly with pointer)
 * - Retina DPI canvas overlay with devicePixelRatio scaling
 * - Velocity-aware blade arc trail (fades during slow reading, sweeps into vivid crimson arc on swift moves)
 * - Alternating twin-katana diagonal click slash (white-hot core + crimson edges, decays in 150ms)
 * - Dynamic katana feedback: crimson glow and ready-strike tilt on link hover, tactical slice cut on click
 * - Zero React re-renders on pointer movement (driven purely via requestAnimationFrame)
 * - Automatically hides native cursor via .katana-cursor-active class on desktop
 * - Bypasses completely on mobile/touch screens and respects prefers-reduced-motion
 */
export default function KatanaSliceCursor() {
  const canvasRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);

  // High-frequency mutable state stored in refs to avoid React re-renders
  const mousePosRef = useRef({ x: -100, y: -100, visible: false });
  const pointsRef = useRef([]);
  const slashesRef = useRef([]);
  const slashCounterRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef(0);
  const isHoveringRef = useRef(false);
  const clickAnimRef = useRef({ active: false, startTime: 0 });
  const animFrameIdRef = useRef(null);

  // Device & accessibility checks (mobile, touch, reduced motion)
  useEffect(() => {
    const evaluateDevice = () => {
      if (typeof window === "undefined") return false;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isMobileWidth = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      return !isTouch && !isMobileWidth && !prefersReducedMotion;
    };

    setIsEnabled(evaluateDevice());

    const handleResize = () => {
      setIsEnabled(evaluateDevice());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    // Hide native cursor when Katana cursor is active
    document.body.classList.add("katana-cursor-active");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Retina display scaling
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Trail and animation constants
    const maxTrailAge = 220; // ms trail duration
    const BASE_ANGLE = Math.PI / 4.1; // ~44 degrees (tip points up-left, hilt extends down-right)

    // Helper to draw Deadpool's signature katana
    const drawKatana = (x, y, angle, isHover) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // If hovering interactive link, emit vivid Deadpool crimson ruby glow
      if (isHover) {
        ctx.shadowColor = "rgba(225, 29, 72, 0.85)";
        ctx.shadowBlur = 9;
      } else {
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }

      const bladeLength = 22;

      // ── 1. Katana Blade (Steel with razor tip at 0, 0 extending along +X) ──
      ctx.beginPath();
      ctx.moveTo(0, 0); // razor-sharp kissaki tip
      ctx.lineTo(2.8, -1.2); // mune spine curve
      ctx.lineTo(bladeLength, -1.2); // spine to habaki collar
      ctx.lineTo(bladeLength, 1.2); // cutting edge to collar
      ctx.lineTo(1.8, 1.2); // razor ha curve
      ctx.closePath();

      // Steel gradient: gleaming silver reflection with crimson razor edge on hover
      const steelGrad = ctx.createLinearGradient(0, -1.2, 0, 1.2);
      steelGrad.addColorStop(0, "#ffffff"); // spine gleam
      steelGrad.addColorStop(0.35, "#e2e8f0");
      steelGrad.addColorStop(0.8, isHover ? "#fecdd3" : "#cbd5e1");
      steelGrad.addColorStop(1, isHover ? "#e11d48" : "#94a3b8"); // sharp cutting edge
      ctx.fillStyle = steelGrad;
      ctx.fill();

      // Bo-hi (blade fuller groove)
      ctx.beginPath();
      ctx.moveTo(3.5, -0.2);
      ctx.lineTo(bladeLength - 2, -0.2);
      ctx.strokeStyle = isHover ? "#dc2626" : "#64748b";
      ctx.lineWidth = 0.55;
      ctx.stroke();

      // Ha razor-edge highlight
      ctx.beginPath();
      ctx.moveTo(1.2, 1.2);
      ctx.lineTo(bladeLength, 1.2);
      ctx.strokeStyle = isHover ? "#ffffff" : "#f8fafc";
      ctx.lineWidth = 0.45;
      ctx.stroke();

      // ── 2. Habaki (brass blade collar) ──
      ctx.fillStyle = "#d97706";
      ctx.fillRect(bladeLength, -1.4, 2.2, 2.8);
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(bladeLength, -1.4, 0.8, 2.8);

      // ── 3. Tsuba (Deadpool's matte black steel octagonal guard with red rim) ──
      const tsubaX = bladeLength + 2.2;
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.roundRect(tsubaX, -4.5, 2.2, 9, 1);
      ctx.fill();

      // Tsuba crimson center rim
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(tsubaX + 0.6, -2.6, 1, 5.2);

      // ── 4. Tsuka (Hilt wrapped in Deadpool's red underwrap & black diamond braid) ──
      const tsukaX = tsubaX + 2.2;
      const tsukaLength = 11.5;

      // Base crimson underwrap
      ctx.fillStyle = "#b91c1c";
      ctx.fillRect(tsukaX, -1.4, tsukaLength, 2.8);

      // Black ito diamond cross-wrap
      ctx.strokeStyle = "#09090b";
      ctx.lineWidth = 0.8;
      for (let d = 1.4; d < tsukaLength - 1; d += 2.5) {
        ctx.beginPath();
        ctx.moveTo(tsukaX + d - 1, -1.4);
        ctx.lineTo(tsukaX + d + 1, 1.4);
        ctx.moveTo(tsukaX + d + 1, -1.4);
        ctx.lineTo(tsukaX + d - 1, 1.4);
        ctx.stroke();
      }

      // ── 5. Kashira (Steel pommel cap) ──
      const kashiraX = tsukaX + tsukaLength;
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.roundRect(kashiraX, -1.6, 2, 3.2, 0.8);
      ctx.fill();

      // Kashira brass accent
      ctx.fillStyle = "#d97706";
      ctx.fillRect(kashiraX, -0.6, 0.7, 1.2);

      ctx.restore();
    };

    // Main continuous rendering loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const now = performance.now();
      const mouse = mousePosRef.current;

      // ── 1. Prune expired trail points ────────────────────────
      pointsRef.current = pointsRef.current.filter(
        (p) => now - p.time <= maxTrailAge
      );
      const pts = pointsRef.current;

      // ── 2. Render Katana Blade Arc Trail ─────────────────────
      if (pts.length >= 3) {
        const latestVel = velocityRef.current;
        // Velocity threshold: subtle when reading, razor-sharp on fast swish
        const velFactor = Math.min(Math.max((latestVel - 70) / 450, 0), 1);

        if (velFactor > 0.04) {
          ctx.save();
          ctx.globalCompositeOperation = "source-over";

          for (let i = 1; i < pts.length; i++) {
            const p0 = pts[i - 1];
            const p1 = pts[i];
            const segProgress = i / (pts.length - 1); // 0 at tail, 1 at tip
            const age = now - p1.time;
            const ageAlpha = Math.max(0, 1 - age / maxTrailAge);
            const alpha = ageAlpha * velFactor;

            if (alpha <= 0.01) continue;

            const taper = Math.sin(segProgress * Math.PI);
            const strokeWidth = 0.75 + taper * 4.5 * velFactor;

            // Deadpool signature gradient: Scarlet (#dc2626) -> Crimson Ruby (#e11d48) -> Deep Burgundy (#991b1b)
            const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
            grad.addColorStop(0, `rgba(153, 27, 27, ${alpha * 0.35})`);
            grad.addColorStop(0.5, `rgba(225, 29, 72, ${alpha * 0.85})`);
            grad.addColorStop(1, `rgba(220, 38, 38, ${alpha})`);

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();

            // White-hot razor blade core on high-velocity cuts
            if (velFactor > 0.35 && segProgress > 0.3) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.75 * (velFactor - 0.25)})`;
              ctx.lineWidth = Math.max(0.6, strokeWidth * 0.32);
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.stroke();
            }
          }

          ctx.restore();
        }
      }

      // ── 3. Render Click Slice Slash Effect ────────────────────
      slashesRef.current = slashesRef.current.filter((slash) => {
        const elapsed = now - slash.startTime;
        if (elapsed >= slash.duration) return false;

        const progress = elapsed / slash.duration; // 0 to 1
        const alpha = Math.max(0, 1 - Math.pow(progress, 1.3)); // exponential decay
        const currentLength =
          slash.length * (0.35 + 0.65 * Math.sin(progress * Math.PI * 0.5));

        const cos = Math.cos(slash.angle);
        const sin = Math.sin(slash.angle);

        const x1 = slash.x - (currentLength / 2) * cos;
        const y1 = slash.y - (currentLength / 2) * sin;
        const x2 = slash.x + (currentLength / 2) * cos;
        const y2 = slash.y + (currentLength / 2) * sin;

        ctx.save();
        ctx.globalCompositeOperation = "source-over";

        // Outer crimson/ruby slash aura
        ctx.beginPath();
        ctx.strokeStyle = `rgba(225, 29, 72, ${alpha * 0.9})`;
        ctx.lineWidth = 4.2 * (1 - progress * 0.6);
        ctx.lineCap = "round";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Inner white-hot cutting edge
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1.6 * (1 - progress * 0.7);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Subtle micro spark at slash origin
        if (progress < 0.4) {
          const sparkAlpha = (1 - progress / 0.4) * 0.8;
          ctx.fillStyle = `rgba(255, 255, 255, ${sparkAlpha})`;
          ctx.beginPath();
          ctx.arc(slash.x, slash.y, 1.8 * (1 - progress), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      // ── 4. Render Deadpool Katana Cursor at Pointer Location ──
      if (mouse.visible) {
        // Calculate dynamic tilt angle:
        // Base orientation: ~44° (pointing up-left)
        // Velocity tilt: tilts with movement
        // Hover tilt: angles up ready to strike
        // Click slash: swift tactical snap
        let angle = BASE_ANGLE;

        const velTilt = Math.max(
          -0.2,
          Math.min(0.2, (velocityRef.current / 1200) * 0.15)
        );
        angle += velTilt;

        if (isHoveringRef.current) {
          angle -= 0.12; // tilt blade slightly forward
        }

        let clickProgress = 0;
        if (clickAnimRef.current.active) {
          const clickElapsed = now - clickAnimRef.current.startTime;
          if (clickElapsed < 120) {
            clickProgress = 1 - clickElapsed / 120;
            // Quick 18-degree slash snap and recovery
            angle += Math.sin(clickProgress * Math.PI) * 0.32;
          } else {
            clickAnimRef.current.active = false;
          }
        }

        drawKatana(
          mouse.x,
          mouse.y,
          angle,
          isHoveringRef.current
        );
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    // ── Mouse & Pointer Event Listeners ────────────────────────
    const onPointerMove = (e) => {
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;

      mousePosRef.current = { x, y, visible: true };

      const last = lastPosRef.current;
      const dt = Math.max(1, now - last.time);
      const dist = Math.hypot(x - last.x, y - last.y);
      const instantVelocity = (dist / dt) * 1000;

      // Smooth velocity
      velocityRef.current = velocityRef.current * 0.65 + instantVelocity * 0.35;

      pointsRef.current.push({
        x,
        y,
        time: now,
      });

      lastPosRef.current = { x, y, time: now };
    };

    const onPointerDown = (e) => {
      const now = performance.now();
      slashCounterRef.current += 1;

      // Trigger sword slash animation
      clickAnimRef.current = { active: true, startTime: now };

      // Alternate twin-katana angles: -40° and +40°
      const isAlt = slashCounterRef.current % 2 === 0;
      const baseAngle = isAlt ? -Math.PI / 4.3 : Math.PI / 4.3; // ~42° diagonal cut
      const angle = baseAngle + (Math.random() - 0.5) * 0.12;
      const length = 40 + Math.random() * 10; // 40px to 50px

      slashesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        angle,
        length,
        startTime: now,
        duration: 150, // complete fadeout within 150ms
      });
    };

    const onMouseEnter = () => {
      mousePosRef.current.visible = true;
    };

    const onMouseLeave = () => {
      mousePosRef.current.visible = false;
    };

    // Detect clickable element hovers via event delegation
    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        target.closest(
          'a, button, [role="button"], input, textarea, select, [tabindex="0"], label'
        )
      ) {
        isHoveringRef.current = true;
      } else {
        isHoveringRef.current = false;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      document.body.classList.remove("katana-cursor-active");
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999999] select-none will-change-transform"
      aria-hidden="true"
    />
  );
}
