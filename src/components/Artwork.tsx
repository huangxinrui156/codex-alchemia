import type { ReactNode } from "react";
import { byId } from "../engine/graph";

const icons: Record<string, ReactNode> = {
  flask: (
    <>
      <path d="M9 3h6M10 3v6L4 19q-.5 2 2 2h12q2.5 0 2-2l-6-10V3M8 15h8" />
      <circle cx="11" cy="17" r=".7" />
    </>
  ),
  book: (
    <>
      <path d="M3 5q5-2 9 1 4-3 9-1v14q-5-2-9 1-4-3-9-1zM12 6v14" />
    </>
  ),
  archive: (
    <>
      <path d="M5 4h13l2 2v15H5zM8 4v17M11 9h6m-6 4h5" />
    </>
  ),
  sound: (
    <>
      <path d="M3 10h4l5-4v12l-5-4H3zM16 8q4 4 0 8M19 5q7 7 0 14" />
    </>
  ),
  mute: (
    <>
      <path d="M3 10h4l5-4v12l-5-4H3zM16 9l6 6m0-6-6 6" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9a3 3 0 1 1 5 2q-2 1-2 3m0 3h.01" />
    </>
  ),
  trash: (
    <>
      <path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="6.5" />
      <path d="m15 15 5 5" />
    </>
  ),
  drawer: (
    <>
      <path d="m3 8 4-4h10l4 4v11H3zM3 9h5l2 3h4l2-3h5" />
    </>
  ),
  star: <path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3z" />,
  up: <path d="m6 14 6-6 6 6" />,
  close: <path d="m6 6 12 12m0-12L6 18" />,
  trophy: (
    <>
      <path d="M7 3h10v5q0 7-5 7T7 8zM7 5H3q0 6 5 6m9-6h4q0 6-5 6m-4 4v5m-5 1h10" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  hand: (
    <>
      <path d="M6 12V6a1.5 1.5 0 0 1 3 0v6-8a1.5 1.5 0 0 1 3 0v8-7a1.5 1.5 0 0 1 3 0v7-4a1.5 1.5 0 0 1 3 0v7q0 7-6 7-4 0-6-4l-3-5q0-2 3-1z" />
    </>
  ),
};
export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}
export function Seal() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      className="brand-seal"
    >
      <path d="M32 1 61 32 32 63 3 32Z M32 7 55 32 32 57 9 32Z" />
      <circle cx="32" cy="32" r="20" />
      <path d="m32 11 18 32H14zM20 22h24L32 48zM32 12v41M12 32h40" />
      <circle cx="32" cy="32" r="9" />
      <path d="m32 24 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" />
    </svg>
  );
}
const waveLines = [0, 1, 2, 3].map((i) => (
  <path key={i} d={`M8 ${43 + i * 3}q6 -4 12 0t12 0t12 0t12 0`} />
));
const engravings: Record<string, ReactNode> = {
  water: (
    <>
      {waveLines}
      <path d="M13 40q11 0 16-12 5-13 14-11 7 1 6 8-5-4-8-1-6 6 1 11 4 3 11 1-7 6-15 4-11-2-13-9M17 40q10-3 14-13 4-10 11-8m-16 21q4-2 6-8 0 7 9 8M35 26q-4 10 5 12M43 26q0 5 6 5" />
      <path d="m10 36 4-1m1-4 3-1m27-16 2 1m4 3 2 2" />
    </>
  ),
  fire: (
    <>
      <path d="M31 53c-18-1-22-14-13-27-1 8 5 10 6 4 0-9 11-13 8-24 14 9 5 20 13 24l2-9c13 18 6 32-16 32Z" />
      <path d="M29 51c-10-4-10-11-5-17-1 8 6 7 6 0 0-5 6-9 6-15 5 9-2 15 4 20l3-5c5 10-1 16-9 18M31 49q-5-4 1-10 0 5 4 6l-2 5M19 30q-8 15 4 20m21-5 3-5M39 12l2 3m-21 6 1-5M52 34l1 3M15 54q18 4 36-1" />
    </>
  ),
  earth: (
    <>
      <path d="m4 48 15-21 6 7L37 13l22 36Zm9-1 7-14 4 6m0 8 13-29 7 18 3-4 10 16M27 30l3 3 7-10 4 6 3-1M34 33l-6 12m9-15-5 14m7-10-4 10m7-9-3 9m5-4-2 4M8 51q21-4 47 0m-39 3 15-1m4 0 12 1" />
      <circle cx="18" cy="19" r="4.4" />
      <path d="M11 23l-2 1m9-13v-2m-6 6-2-1m14-1 1-2" />
    </>
  ),
  air: (
    <>
      <path d="M6 29c10-9 18 4 30-2 7-3 6-13-1-13-7 0-7 8-1 8 2 0 3-2 2-3M6 34c14-8 25 4 38-5 12-8 17 6 9 9-5 1-7-5-3-6M11 39c10-6 22 3 30-1 9-5 13 6 7 11-5 4-12 1-10-4 1-3 5-3 6-1M16 45q9-4 17-1M12 24q9-5 16-1m-10-5 7 1M20 50l9-1M42 12l2 2m10 7-5 2" />
    </>
  ),
  自然: (
    <>
      <path d="m5 48 15-26 9 13 9-19 20 32zM15 33l5-5 5 7m7-7 6-7 7 9M27 47l11-22M11 52h42" />
      <circle cx="15" cy="16" r="5" />
    </>
  ),
  造物: (
    <>
      <path d="M22 10h20l-4 8q1 6 9 13 10 13-4 21H21Q7 43 17 31q10-9 9-13zM23 13h17M24 23h15M18 34h28M16 40h32M22 48h20" />
      <path d="m21 36 3 3 4-3 4 3 4-3 4 3 4-3" />
    </>
  ),
  生命: (
    <>
      <path d="M13 53q11-20 35-39M17 46C9 24 29 14 51 10c0 24-9 41-34 36Zm2-8 1-12m4 6 2-12m4 6 2-9m-7 16 16-3m-21 11 14-3" />
    </>
  ),
  文明: (
    <>
      <path d="m6 23 26-14 26 14zM10 26h44M12 48h40M8 52h48M15 27v19m5-19v19m8-19v19m6-19v19m9-19v19m6-19v19M16 21l16-8 16 8z" />
    </>
  ),
  科技: (
    <>
      <circle cx="32" cy="32" r="17" />
      <circle cx="32" cy="32" r="9" />
      <circle cx="32" cy="32" r="4" />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          transform={`rotate(${i * 30} 32 32)`}
          d="m29 15 1-5h4l1 5"
        />
      ))}
    </>
  ),
  概念: (
    <>
      <path d="M7 32q24-27 50 0-26 26-50 0Z" />
      <circle cx="32" cy="32" r="9" />
      <circle cx="32" cy="32" r="3" />
      <path d="m32 8 1 9m12-5-4 7m-21-7 4 7m8 29v8m-9-12-4 7m22-7 4 7" />
    </>
  ),
  奇观: (
    <>
      <path d="m32 5 6 19 19 7-19 7-6 21-6-21-19-7 19-7zM32 12v39m-18-20h36" />
      <circle cx="32" cy="31" r="16" />
    </>
  ),
};
export const kind = (id: string) =>
  ({ 水: "water", 火: "fire", 土: "earth", 风: "air" })[id] ||
  byId.get(id)?.category ||
  "概念";
export function Emblem({ id }: { id: string }) {
  return (
    <svg
      className={"emblem type-" + kind(id)}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {engravings[kind(id)]}
    </svg>
  );
}
export function CardFace({ id }: { id: string }) {
  const el = byId.get(id)!;
  return (
    <>
      <span className="specimen">
        <Emblem id={id} />
      </span>
      <span className="card-text">
        <small>№ {String(el.no).padStart(3, "0")}</small>
        <strong>{id}</strong>
        <i>{el.en}</i>
      </span>
    </>
  );
}
