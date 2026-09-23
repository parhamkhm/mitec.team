// mitec — scroll-timeline maths. Pure functions of a 0–1 progress value.

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

// Local progress of p inside the window [a, b], clamped to 0–1.
export const seg = (p, a, b) => clamp((p - a) / (b - a));

export const lerp = (a, b, t) => a + (b - a) * t;

export const inCubic = (t) => t * t * t;
export const outCubic = (t) => 1 - (1 - t) ** 3;
export const inOutSine = (t) => (1 - Math.cos(Math.PI * t)) / 2;
export const inOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Frame-rate-independent exponential approach toward `to`; tau in ms.
export const damp = (from, to, dt, tau) => from + (to - from) * (1 - Math.exp(-dt / tau));
