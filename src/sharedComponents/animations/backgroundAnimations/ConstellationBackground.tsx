"use client";

import { useEffect, useRef } from "react";

export interface ConstellationBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  /** Number of nodes */
  count?: number;
  /** Maximum distance for connections */
  connectionDistance?: number;
  /** Node color */
  nodeColor?: string;
  /** Line color */
  lineColor?: string;
  /** Node size */
  nodeSize?: number;
  /** Mouse repulsion radius */
  mouseRadius?: number;
  /** Enable glow effect */
  glow?: boolean;
  style?: React.CSSProperties;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function ConstellationBackground({
  className,
  children,
  count = 80,
  connectionDistance = 150,
  nodeColor = "rgba(139, 92, 246, 1)",
  lineColor = "rgba(139, 92, 246, 0.25)",
  nodeSize = 2,
  mouseRadius = 100,
  glow = true,
  style,
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const createNode = (): Node => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.6;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * nodeSize + nodeSize * 0.5,
      };
    };

    const nodes: Node[] = Array.from({ length: count }, createNode);

    const handleMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      const r = container.getBoundingClientRect();
      width = r.width;
      height = r.height;
      canvas.width = width;
      canvas.height = height;
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        if (mouseRadius > 0) {
          const dx = node.x - mouseX;
          const dy = node.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius && dist > 0) {
            const force = ((mouseRadius - dist) / mouseRadius) * 0.02;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        node.x += node.vx;
        node.y += node.vy;

        // Gentle random steering (no damping so speed is preserved)
        node.vx += (Math.random() - 0.5) * 0.05;
        node.vy += (Math.random() - 0.5) * 0.05;

        // Clamp to max speed
        const maxSpeed = 1.2;
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > maxSpeed) {
          node.vx = (node.vx / speed) * maxSpeed;
          node.vy = (node.vy / speed) * maxSpeed;
        }

        // Enforce minimum speed so nodes never stall
        const minSpeed = 0.3;
        if (speed < minSpeed && speed > 0) {
          node.vx = (node.vx / speed) * minSpeed;
          node.vy = (node.vy / speed) * minSpeed;
        }

        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(width, node.x));
        }
        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(height, node.y));
        }
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const opacity = 1 - dist / connectionDistance;
            ctx.globalAlpha = opacity * 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      for (const node of nodes) {
        if (glow) {
          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            node.radius * 4
          );
          gradient.addColorStop(0, nodeColor.replace("1)", "0.3)"));
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      ro.disconnect();
    };
  }, [count, connectionDistance, nodeColor, lineColor, nodeSize, mouseRadius, glow]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        backgroundColor: "#ffffff",
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      {children && (
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default ConstellationBackground;
