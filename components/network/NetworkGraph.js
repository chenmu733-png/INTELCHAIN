'use client';

import { useEffect, useRef, useState } from 'react';
import { buildGraph, NODE_COLORS } from '@/lib/graph';

// Lightweight force-directed graph on canvas with animated, flowing edges.
export default function NetworkGraph({ seed = 'intelchain', onSelect }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [hoverId, setHoverId] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const graph = buildGraph(seed);

    const view = { scale: 1, ox: 0, oy: 0 };
    const drag = { node: null, panning: false, lastX: 0, lastY: 0 };
    stateRef.current = { graph, view, drag };

    let raf;
    let dash = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function tick() {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const { nodes, edges } = graph;

      // simple force simulation
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (drag.node === a) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy || 1;
          const rep = 14000 / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * rep;
          const fy = (dy / d) * rep;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }
        // pull to center
        a.vx += -a.x * 0.0015;
        a.vy += -a.y * 0.0015;
      }
      for (const e of edges) {
        const s = nodes[e.source];
        const t = nodes[e.target];
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const k = (d - 150) * 0.01;
        const fx = (dx / d) * k;
        const fy = (dy / d) * k;
        if (drag.node !== s) { s.vx += fx; s.vy += fy; }
        if (drag.node !== t) { t.vx -= fx; t.vy -= fy; }
      }
      for (const n of nodes) {
        if (drag.node === n) continue;
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
      }

      // draw
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.save();
      ctx.translate(cx + view.ox, cy + view.oy);
      ctx.scale(view.scale, view.scale);

      dash = (dash + 0.6) % 16;
      for (const e of edges) {
        const s = nodes[e.source];
        const t = nodes[e.target];
        const active = hoverId != null && (e.source === hoverId || e.target === hoverId);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = active ? 'rgba(34,229,132,0.8)' : 'rgba(34,229,132,0.18)';
        ctx.lineWidth = active ? 2 : 1;
        ctx.setLineDash([6, 10]);
        ctx.lineDashOffset = -dash * e.dir;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      for (const n of nodes) {
        const r = n.kind === 'target' ? 16 : 9 + Math.min(8, n.value / 800000);
        const color = NODE_COLORS[n.kind] || '#64748b';
        const active = hoverId === n.id;
        // glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + (active ? 10 : 6), 0, Math.PI * 2);
        ctx.fillStyle = color + '22';
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = active ? 22 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        // label
        if (view.scale > 0.7 || n.kind === 'target' || active) {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + r + 14);
        }
      }
      ctx.restore();
      raf = requestAnimationFrame(tick);
    }
    tick();

    // interaction helpers
    function toWorld(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      return {
        x: (clientX - rect.left - cx - view.ox) / view.scale,
        y: (clientY - rect.top - cy - view.oy) / view.scale
      };
    }
    function nodeAt(clientX, clientY) {
      const p = toWorld(clientX, clientY);
      return graph.nodes.find((n) => {
        const r = n.kind === 'target' ? 16 : 12;
        return (n.x - p.x) ** 2 + (n.y - p.y) ** 2 <= (r + 6) ** 2;
      });
    }

    function onDown(ev) {
      const e = ev.touches ? ev.touches[0] : ev;
      const n = nodeAt(e.clientX, e.clientY);
      if (n) {
        drag.node = n;
        onSelect && onSelect(n);
      } else {
        drag.panning = true;
      }
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
    }
    function onMove(ev) {
      const e = ev.touches ? ev.touches[0] : ev;
      if (drag.node) {
        const p = toWorld(e.clientX, e.clientY);
        drag.node.x = p.x; drag.node.y = p.y;
        drag.node.vx = 0; drag.node.vy = 0;
      } else if (drag.panning) {
        view.ox += e.clientX - drag.lastX;
        view.oy += e.clientY - drag.lastY;
        drag.lastX = e.clientX; drag.lastY = e.clientY;
      } else {
        const n = nodeAt(e.clientX, e.clientY);
        setHoverId(n ? n.id : null);
        canvas.style.cursor = n ? 'pointer' : 'grab';
      }
    }
    function onUp() {
      drag.node = null;
      drag.panning = false;
    }
    function onWheel(ev) {
      ev.preventDefault();
      const delta = -ev.deltaY * 0.001;
      view.scale = Math.min(2.5, Math.max(0.4, view.scale + delta));
    }

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('touchend', onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onUp);
    };
  }, [seed, hoverId, onSelect]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full touch-none rounded-2xl"
      style={{ cursor: 'grab' }}
    />
  );
}
