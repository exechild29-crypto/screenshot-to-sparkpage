/**
 * Interactive vertical-fold background for the homepage hero.
 *
 * Plain WebGL (no dependencies): a fragment shader models the folds as a
 * height field, lights it from the upper right and bends the folds around a
 * smoothed cursor position. Per-frame state lives in this module, never in
 * React state. The render loop only runs while the surface is moving and
 * stops once it has settled back to rest.
 */

/* ---------- Feel (tune here) ---------- */
/** Fold width as a share of the hero width, clamped in CSS px. */
export const FOLD_PERIOD_RATIO = 0.042;
export const FOLD_PERIOD_MIN = 52;
export const FOLD_PERIOD_MAX = 84;
/** Radius (px) of the area around the cursor that deforms. */
const INFLUENCE_RADIUS = 220;
/** How strongly folds swell around the cursor. */
const LENS_STRENGTH = 0.32;
/** How far folds are dragged along with cursor movement (per px/s). */
const DRAG_STRENGTH = 0.028;
/** Ripple amplitude in px while hovering still / added while moving. */
const RIPPLE_IDLE = 4;
const RIPPLE_MOTION = 14;
/** Easing rates (per second): higher is snappier. */
const POSITION_EASE = 7;
const VELOCITY_EASE = 5;
const ENERGY_EASE = 3;
const AMP_IN_EASE = 3.2;
const AMP_OUT_EASE = 2.2;
const MAX_SPEED = 1400;
const MAX_DPR = 2;

export function foldPeriod(width: number) {
  return Math.min(FOLD_PERIOD_MAX, Math.max(FOLD_PERIOD_MIN, width * FOLD_PERIOD_RATIO));
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uBuf;
uniform float uDpr;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uAmp;
uniform float uEnergy;
uniform float uTime;
uniform float uPeriod;
uniform vec3 uSurface;
uniform vec3 uRecess;
uniform vec3 uShadow;

const float SIGMA = ${INFLUENCE_RADIUS.toFixed(1)};

float influence(vec2 p) {
  vec2 d = p - uMouse;
  return exp(-dot(d, d) / (2.0 * SIGMA * SIGMA));
}

// Horizontal position on the undeformed fabric for a screen point.
float warpX(vec2 p) {
  vec2 d = p - uMouse;
  float r = length(d);
  float g = exp(-(r * r) / (2.0 * SIGMA * SIGMA));
  float lens = -d.x * g * ${LENS_STRENGTH.toFixed(3)};
  float drag = -uVel.x * ${DRAG_STRENGTH.toFixed(4)} * g;
  float wave = sin(r * 0.034 - uTime * 2.6) * exp(-r / 300.0)
             * (${RIPPLE_IDLE.toFixed(1)} + ${RIPPLE_MOTION.toFixed(1)} * uEnergy);
  float ripple = wave * (d.x / (r + 24.0));
  return p.x + uAmp * (lens + drag + ripple);
}

// Fold profile (0..1): a long convex face that turns towards the light,
// then a short soft drop into the next fold, like the reference image.
float profile(float f) {
  const float A = 0.8;
  const float K = 0.62 * 3.14159265;
  if (f < A) return sin((f / A) * K) / sin(K);
  float t = (f - A) / (1.0 - A);
  return 1.0 - t * t * (3.0 - 2.0 * t);
}

float heightAt(vec2 p) {
  return profile(fract(warpX(p) / uPeriod));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uBuf.y - gl_FragCoord.y) / uDpr;
  float h = heightAt(p);
  // Wide central differences soften the crease between folds over a few px.
  const float E = 2.5;
  float hx = (heightAt(p + vec2(E, 0.0)) - heightAt(p - vec2(E, 0.0))) / (2.0 * E);
  float hy = (heightAt(p + vec2(0.0, E)) - heightAt(p - vec2(0.0, E))) / (2.0 * E);

  float depth = uPeriod * 0.2;
  vec3 n = normalize(vec3(-hx * depth, hy * depth, 1.0));
  vec3 L = normalize(vec3(0.62, 0.32, 0.72));

  float shade = max(dot(n, L), 0.0) / L.z;
  float ao = mix(0.93, 1.0, h);
  // Compress contrast so the folds stay soft and never turn dark.
  float v = mix(1.0, shade * ao, 0.7);
  // Very soft overall light fall-off from right to left, as in the reference.
  v *= mix(0.975, 1.01, p.x / max(uBuf.x / uDpr, 1.0));

  vec3 col = mix(uShadow, uRecess, smoothstep(0.55, 0.94, v));
  col = mix(col, uSurface, smoothstep(0.93, 1.08, v));

  // Gentle highlight on raised crests and around the cursor.
  vec3 R = reflect(-L, n);
  col += pow(max(R.z, 0.0), 28.0) * 0.06;
  col += uAmp * influence(p) * 0.012;

  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

type RGB = [number, number, number];

function readColor(el: Element, name: string, fallback: RGB): RGB {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  if (!value) return fallback;
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallback;
  const sentinel = "#010203";
  ctx.fillStyle = sentinel;
  ctx.fillStyle = value;
  if (ctx.fillStyle === sentinel) return fallback;
  ctx.fillRect(0, 0, 1, 1);
  const [r = 255, g = 255, b = 255] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("fold-wave shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/**
 * Starts the effect. `wrap` is the background layer (sized like the hero),
 * `host` is the element whose pointer movement drives the waves.
 * Returns a cleanup function.
 */
export function startFoldWave(
  canvas: HTMLCanvasElement,
  wrap: HTMLElement,
  host: HTMLElement,
): () => void {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return () => {};

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return () => {};
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(program, n);
  const loc = {
    buf: u("uBuf"), dpr: u("uDpr"), mouse: u("uMouse"), vel: u("uVel"), amp: u("uAmp"),
    energy: u("uEnergy"), time: u("uTime"), period: u("uPeriod"),
    surface: u("uSurface"), recess: u("uRecess"), shadow: u("uShadow"),
  };

  const media = (q: string) => window.matchMedia(q).matches;
  const interactive =
    media("(hover: hover) and (pointer: fine)") && !media("(prefers-reduced-motion: reduce)");

  let width = 0;
  let height = 0;
  let dpr = 1;
  let disposed = false;
  let visible = true;

  const target = { x: -9999, y: -9999 };
  const mouse = { x: -9999, y: -9999 };
  const vel = { x: 0, y: 0 };
  let amp = 0;
  let ampTarget = 0;
  let energy = 0;
  let time = 0;
  let raf = 0;
  let last = 0;

  const applyColors = () => {
    const s = readColor(wrap, "--fold-surface", [1, 1, 1]);
    const r = readColor(wrap, "--fold-recess", [0.95, 0.955, 0.96]);
    const sh = readColor(wrap, "--fold-shadow", [0.84, 0.85, 0.87]);
    gl.uniform3fv(loc.surface, s);
    gl.uniform3fv(loc.recess, r);
    gl.uniform3fv(loc.shadow, sh);
  };

  const draw = () => {
    if (disposed || width === 0 || height === 0) return;
    gl.uniform2f(loc.buf, canvas.width, canvas.height);
    gl.uniform1f(loc.dpr, dpr);
    gl.uniform2f(loc.mouse, mouse.x, mouse.y);
    gl.uniform2f(loc.vel, vel.x, vel.y);
    gl.uniform1f(loc.amp, amp);
    gl.uniform1f(loc.energy, energy);
    gl.uniform1f(loc.time, time);
    gl.uniform1f(loc.period, foldPeriod(width));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    wrap.dataset["live"] = "true";
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;

    const px = mouse.x;
    const py = mouse.y;
    const kPos = 1 - Math.exp(-dt * POSITION_EASE);
    mouse.x += (target.x - mouse.x) * kPos;
    mouse.y += (target.y - mouse.y) * kPos;

    const clampV = (v: number) => Math.max(-MAX_SPEED, Math.min(MAX_SPEED, v));
    const kVel = 1 - Math.exp(-dt * VELOCITY_EASE);
    vel.x += (clampV((mouse.x - px) / dt) - vel.x) * kVel;
    vel.y += (clampV((mouse.y - py) / dt) - vel.y) * kVel;

    const speed = Math.min(Math.hypot(vel.x, vel.y) / 900, 1);
    energy += (speed - energy) * (1 - Math.exp(-dt * ENERGY_EASE));
    const ampRate = ampTarget > amp ? AMP_IN_EASE : AMP_OUT_EASE;
    amp += (ampTarget - amp) * (1 - Math.exp(-dt * ampRate));
    time += dt;

    const settled = ampTarget === 0 && amp < 0.002;
    if (settled) {
      amp = 0;
      energy = 0;
      vel.x = vel.y = 0;
    }
    draw();

    if (settled || !visible || document.hidden) {
      last = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (!raf && !disposed && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const rect = wrap.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const rect = wrap.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
    if (amp < 0.01) {
      // Start the deformation where the cursor is rather than sweeping in.
      mouse.x = target.x;
      mouse.y = target.y;
    }
    ampTarget = 1;
    kick();
  };
  const onLeave = () => {
    ampTarget = 0;
    kick();
  };
  const onVisibility = () => kick();
  const onContextLost = (e: Event) => {
    e.preventDefault();
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    wrap.dataset["live"] = "false";
  };

  applyColors();
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible && (amp > 0 || ampTarget > 0)) kick();
  });
  io.observe(wrap);

  canvas.addEventListener("webglcontextlost", onContextLost);
  if (interactive) {
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
  }

  return () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    canvas.removeEventListener("webglcontextlost", onContextLost);
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}
