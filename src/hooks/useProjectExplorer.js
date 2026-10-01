import { useCallback, useEffect, useRef, useState } from "react";

/** Native touch/trackpad scrolling, with mouse and keyboard alternatives. */
export default function useProjectExplorer(count) {
  const trackRef = useRef(null);
  const activeRef = useRef(0);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);

  const select = useCallback((index, immediate = false) => {
    const track = trackRef.current;
    const next = Math.max(0, Math.min(count - 1, index));
    const card = track?.children[next];
    if (!card) return;
    activeRef.current = next;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: card.offsetLeft, behavior: immediate || reduced ? "instant" : "smooth" });
  }, [count]);

  useEffect(() => {
    const track = trackRef.current;
    let frame = 0;
    let wheelTimer;
    let wheelLocked = false;
    let wheelDelta = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = track.children[1]?.offsetLeft || track.clientWidth;
        const index = Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / step)));
        setActive(index);
        if (!wheelLocked && !drag.current) activeRef.current = index;
      });
    };
    const wheel = event => {
      // Keep touchpads' horizontal gestures native and allow browser zoom.
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) ||
          !window.matchMedia("(min-width: 900px) and (pointer: fine)").matches) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientHeight : 1);
      if (!delta) return;
      const direction = Math.sign(delta);
      const atEdge = direction < 0 ? activeRef.current === 0 : activeRef.current === count - 1;
      if (!wheelLocked && atEdge) return; // The next gesture continues the page at either end.
      event.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelLocked = false; wheelDelta = 0; }, 180);
      if (wheelLocked) return;
      wheelDelta = Math.sign(wheelDelta) === direction ? wheelDelta + delta : delta;
      if (Math.abs(wheelDelta) >= 36) {
        wheelLocked = true;
        select(activeRef.current + direction);
      }
    };
    let width = track.clientWidth;
    const resize = new ResizeObserver(() => {
      if (width !== track.clientWidth) {
        width = track.clientWidth;
        select(activeRef.current, true);
      }
    });
    resize.observe(track);
    track.addEventListener("scroll", sync, { passive: true });
    track.addEventListener("wheel", wheel, { passive: false });
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(wheelTimer);
      track.removeEventListener("scroll", sync);
      track.removeEventListener("wheel", wheel);
    };
  }, [count, select]);

  const finishDrag = event => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    drag.current = null;
    const track = trackRef.current;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (!gesture.moved) return;
    const distance = track.scrollLeft - gesture.scroll;
    const next = Math.abs(distance) > 50 ? gesture.index + Math.sign(distance) : gesture.index;
    select(next);
  };

  return {
    trackRef, active, select,
    trackProps: {
      onKeyDown(event) {
        if (event.target !== event.currentTarget) return;
        const destinations = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: count - 1 };
        if (event.key in destinations) {
          event.preventDefault();
          select(destinations[event.key]);
        }
      },
      onPointerDown(event) {
        suppressClick.current = false;
        if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("button, summary, .cw-links, .cw-disclosure")) return;
        drag.current = { id: event.pointerId, x: event.clientX, scroll: event.currentTarget.scrollLeft, index: active, moved: false };
      },
      onPointerMove(event) {
        const gesture = drag.current;
        if (!gesture || gesture.id !== event.pointerId) return;
        const distance = event.clientX - gesture.x;
        if (!gesture.moved && Math.abs(distance) < 6) return;
        gesture.moved = true;
        suppressClick.current = true;
        const track = event.currentTarget;
        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
        track.scrollLeft = gesture.scroll - distance;
        event.preventDefault();
      },
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onLostPointerCapture: finishDrag,
      onPointerLeave(event) {
        if (drag.current && !drag.current.moved) finishDrag(event);
      },
      onDragStart(event) { event.preventDefault(); },
      onClickCapture(event) {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }
      },
    },
  };
}
