import React, { useEffect, useRef, useState } from 'react';

const SEGMENT_COUNT = 45;
const SEGMENT_DISTANCE = 12;
const FRONT_WING_INDEX = 8;
const BACK_WING_INDEX = 22;

export const CyberDragon = () => {
  const targetRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });

  const segmentsRef = useRef(
    Array.from({ length: SEGMENT_COUNT }, () => ({
      x: targetRef.current.x,
      y: targetRef.current.y,
      angle: 0,
    }))
  );

  const [, setTick] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let animId;
    const updateKinematics = () => {
      const segments = segmentsRef.current;
      const target = targetRef.current;

      // Head position towards cursor
      const head = segments[0];
      const dx = target.x - head.x;
      const dy = target.y - head.y;

      head.angle = Math.atan2(dy, dx);
      head.x += dx * 0.15;
      head.y += dy * 0.15;

      // Body segments follow the front segment
      for (let i = 1; i < segments.length; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];

        const segDx = prev.x - curr.x;
        const segDy = prev.y - curr.y;

        curr.angle = Math.atan2(segDy, segDx);
        curr.x = prev.x - Math.cos(curr.angle) * SEGMENT_DISTANCE;
        curr.y = prev.y - Math.sin(curr.angle) * SEGMENT_DISTANCE;
      }

      setTick((prev) => prev + 1);
      animId = requestAnimationFrame(updateKinematics);
    };

    animId = requestAnimationFrame(updateKinematics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const segments = segmentsRef.current;
  const head = segments[0];
  const frontWingSeg = segments[FRONT_WING_INDEX];
  const backWingSeg = segments[BACK_WING_INDEX];

  // Wing flap animation cycle
  const time = Date.now() * 0.008;
  const wingFlap = Math.sin(time) * 0.3 + 0.8;

  // Build spine SVG path string
  const spinePath = segments.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`;
  }, '');

  const renderWing = (seg, side, baseScale) => {
    const angleDeg = (seg.angle * 180) / Math.PI;
    const scaleX = baseScale;
    const scaleY = baseScale * side * wingFlap;

    return (
      <use
        href="#dragon-wing"
        transform={`translate(${seg.x}, ${seg.y}) rotate(${angleDeg}) scale(${scaleX}, ${scaleY})`}
      />
    );
  };

  return (
    <svg style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7700" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff0044" stopOpacity="0.3" />
        </linearGradient>

        <g id="dragon-head">
          <path d="M 0 0 L -18 -8 L -12 0 L -18 8 Z" fill="#ff3300" stroke="#ffaa00" strokeWidth="1.5" />
          <circle cx="-4" cy="-4" r="2" fill="#ffff00" />
          <circle cx="-4" cy="4" r="2" fill="#ffff00" />
          <path d="M -12 -5 L -25 -12 M -12 5 L -25 12" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        <g id="dragon-wing">
          <path
            d="M 0 0 Q 15 -35 45 -55 Q 20 -40 10 -25 Q -5 -35 -20 -45 Q -10 -25 0 0 Z"
            fill="url(#wingGrad)"
            stroke="#ffaa00"
            strokeWidth="1"
          />
          <path
            d="M 0 0 L 45 -55 M 0 0 L 10 -25 M 0 0 L -20 -45"
            stroke="#ffcc00"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </defs>

      <g filter="url(#glow)">
        {/* Spine line */}
        <path d={spinePath} stroke="#ff3300" strokeWidth="1.5" fill="none" />

        {/* Wings */}
        {renderWing(frontWingSeg, -1, 1.0)}
        {renderWing(frontWingSeg, 1, 1.0)}
        {renderWing(backWingSeg, -1, 0.7)}
        {renderWing(backWingSeg, 1, 0.7)}

        {/* Tail / Body Orbs */}
        {segments.map((seg, i) => {
          const radius = Math.max(1.5, 6 * (1 - i / SEGMENT_COUNT));
          return (
            <circle
              key={i}
              cx={seg.x}
              cy={seg.y}
              r={radius}
              fill={i % 2 === 0 ? '#ffffff' : '#ff5500'}
            />
          );
        })}

        {/* Head */}
        <use
          href="#dragon-head"
          transform={`translate(${head.x}, ${head.y}) rotate(${(head.angle * 180) / Math.PI})`}
        />
      </g>
    </svg>
  );
};