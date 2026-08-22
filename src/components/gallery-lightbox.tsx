import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { GalleryImage } from "@/lib/salon";

type Point = { x: number; y: number };

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const panStart = useRef<{ point: Point; offset: Point } | null>(null);
  const swipeStart = useRef<Point | null>(null);
  const swipeDelta = useRef(0);

  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Reset zoom whenever the photo changes.
  useEffect(() => {
    resetZoom();
    pointers.current.clear();
    pinchStart.current = null;
    panStart.current = null;
    swipeStart.current = null;
  }, [index, resetZoom]);

  // Keyboard navigation + lock body scroll while open.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, hasPrev, hasNext, onClose, onNavigate]);

  if (!image) return null;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const a = pts[0]!;
      const b = pts[1]!;
      pinchStart.current = { dist: distance(a, b), scale };
      panStart.current = null;
      swipeStart.current = null;
    } else if (pointers.current.size === 1) {
      const point = { x: e.clientX, y: e.clientY };
      if (scale > 1) {
        panStart.current = { point, offset };
      } else {
        swipeStart.current = point;
        swipeDelta.current = 0;
      }
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = [...pointers.current.values()];
      const a = pts[0]!;
      const b = pts[1]!;
      const ratio = distance(a, b) / pinchStart.current.dist;
      setScale(clamp(pinchStart.current.scale * ratio, MIN_SCALE, MAX_SCALE));
      return;
    }

    if (pointers.current.size === 1 && panStart.current && scale > 1) {
      const dx = e.clientX - panStart.current.point.x;
      const dy = e.clientY - panStart.current.point.y;
      setOffset({
        x: panStart.current.offset.x + dx,
        y: panStart.current.offset.y + dy,
      });
      return;
    }

    if (pointers.current.size === 1 && swipeStart.current) {
      swipeDelta.current = e.clientX - swipeStart.current.x;
    }
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);

    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) {
      // Swipe to navigate when not zoomed in.
      if (swipeStart.current && scale <= 1) {
        const dx = swipeDelta.current;
        if (dx <= -60 && hasNext) onNavigate(index + 1);
        else if (dx >= 60 && hasPrev) onNavigate(index - 1);
      }
      swipeStart.current = null;
      panStart.current = null;
      // Snap back to fit when zoomed all the way out.
      if (scale <= 1.05) resetZoom();
    }
  }

  function onDoubleClick() {
    if (scale > 1) resetZoom();
    else setScale(2);
  }

  function zoomBy(delta: number) {
    setScale((s) => {
      const next = clamp(s + delta, MIN_SCALE, MAX_SCALE);
      if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
      return next;
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer — ${image.alt}`}
      className="fixed inset-0 z-50 flex flex-col bg-noir/95 backdrop-blur-sm"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-noir-foreground">
        <span className="text-sm font-medium text-noir-muted">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => zoomBy(-0.5)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            className="rounded-full p-2 text-noir-foreground transition-colors hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => zoomBy(0.5)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            className="rounded-full p-2 text-noir-foreground transition-colors hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="rounded-full p-2 text-noir-foreground transition-colors hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-2 select-none"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDoubleClick={onDoubleClick}
      >
        <img
          src={image.src}
          alt={image.alt}
          draggable={false}
          className="max-h-full max-w-full rounded-lg object-contain"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: pointers.current.size === 0 ? "transform 0.2s ease-out" : "none",
          }}
        />

        {hasPrev && (
          <button
            type="button"
            onClick={() => onNavigate(index - 1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-noir/60 p-2.5 text-noir-foreground transition-colors hover:bg-noir/90 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={() => onNavigate(index + 1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-noir/60 p-2.5 text-noir-foreground transition-colors hover:bg-noir/90 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="px-4 pb-6 pt-3 text-center">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-noir-muted">
          {image.caption}
        </p>
      </div>
    </div>
  );
}
