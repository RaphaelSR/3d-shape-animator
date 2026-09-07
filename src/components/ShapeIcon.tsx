import type { GeometryType } from '@/utils/types';
const paths: Record<GeometryType, React.ReactNode> = {
  cube: (
    <>
      <path d="m16 3 12 7v13l-12 7L4 23V10Z M4 10l12 7 12-7 M16 17v13" />
    </>
  ),
  sphere: (
    <>
      <circle cx="16" cy="16" r="13" />
      <ellipse cx="16" cy="16" rx="6" ry="13" />
      <path d="M3 16h26 M6 8q10 6 20 0 M6 24q10-6 20 0" />
    </>
  ),
  pyramid: (
    <>
      <path d="m16 3 13 22-13 5L3 25Z M16 3v27 M3 25l13-6 13 6" />
    </>
  ),
  cylinder: (
    <>
      <ellipse cx="16" cy="7" rx="11" ry="4" />
      <path d="M5 7v18c0 6 22 6 22 0V7 M5 25c0-6 22-6 22 0" />
    </>
  ),
  cone: (
    <>
      <path d="M16 3 3 25c0 6 26 6 26 0Z" />
      <ellipse cx="16" cy="25" rx="13" ry="4" />
    </>
  ),
  torus: (
    <>
      <ellipse cx="16" cy="16" rx="14" ry="10" transform="rotate(-30 16 16)" />
      <ellipse cx="16" cy="16" rx="7" ry="4" transform="rotate(-30 16 16)" />
    </>
  ),
  octahedron: (
    <>
      <path d="m16 2 13 14-13 14L3 16Z M3 16h26 M16 2l5 14-5 14-5-14Z" />
    </>
  ),
  dodecahedron: (
    <>
      <path d="m16 2 12 8v13l-12 7L4 23V10Z m0 6 8 6-3 9H11l-3-9Z M16 2v6 M28 10l-4 4 M28 23l-7 0 M16 30l-5-7 M4 23l4-9" />
    </>
  ),
  icosahedron: (
    <>
      <path d="m16 2 12 8v13l-12 7L4 23V10Z M16 2 8 14l8 13 8-13Z M4 10l4 4-4 9 M28 10l-4 4 4 9 M8 14h16 M16 27v3" />
    </>
  ),
  tetrahedron: (
    <>
      <path d="M16 3 3 26l26-3Z M16 3l2 16L3 26 M18 19l11 4" />
    </>
  ),
  capsule: (
    <>
      <rect
        x="8"
        y="2"
        width="16"
        height="28"
        rx="8"
        transform="rotate(30 16 16)"
      />
      <path d="m9 12 14 8" />
    </>
  ),
  ring: (
    <>
      <circle cx="16" cy="16" r="13" />
      <circle cx="16" cy="16" r="8" />
    </>
  ),
};
export function ShapeIcon({
  type,
  size = 30,
}: {
  type: GeometryType;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}
