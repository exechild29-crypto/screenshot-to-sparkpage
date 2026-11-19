/**
 * Glossy 3D infinity logo for the animated intro.
 *
 * Plain three.js (no React): a closed tube follows a lemniscate whose two
 * strands pass over and under each other at the centre. The tube is "drawn"
 * by growing its index draw range along the path, with rounded caps riding
 * the head and tail, so real 3D geometry is constructed — never faded in.
 * Colours come from the brand CSS tokens; lighting is a local studio
 * environment (no network fetches) plus a soft shadow on a white backdrop.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ---------- Shape & look (tune here) ---------- */
const TUBE_RADIUS = 0.16;
/** Vertical stretch of the loops (1 = classic lemniscate). */
const LOOP_HEIGHT = 1.1;
/** Depth offset of the strands at the crossover; must exceed TUBE_RADIUS. */
const CROSS_DEPTH = 0.19;
const TUBULAR_SEGMENTS = 360;
const RADIAL_SEGMENTS = 40;
const CAMERA_FOV = 30;
const CAMERA_DISTANCE = 2.5;
/** Tilt while drawing, and the resting pose it settles into. */
const START_TILT = { x: 0.42, y: -0.32 };
const REST_TILT = { x: 0.1, y: 0 };
const SETTLE_RATE = 4.5;
const IDLE_SWAY = 0.035;
const SHADOW_OPACITY = 0.1;
/** Darkens brand colours on the tube (1 = exact token colour). */
const ALBEDO_DEPTH = 0.72;
const MAX_DPR = 2;

type RGB = [number, number, number];

function cssColor(el: Element, name: string, fallback: RGB): THREE.Color {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  let rgb = fallback;
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (ctx && value) {
    const sentinel = "#010203";
    ctx.fillStyle = sentinel;
    ctx.fillStyle = value;
    if (ctx.fillStyle !== sentinel) {
      ctx.fillRect(0, 0, 1, 1);
      const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
      rgb = [r / 255, g / 255, b / 255];
    }
  }
  return new THREE.Color().setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace);
}

class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  // Curve's constructor is protected in the typings; expose it.
  public constructor() {
    super();
  }

  override getPoint(u: number, target = new THREE.Vector3()) {
    // Starts at the crossover, heading up into the right-hand loop.
    const t = -Math.PI / 2 + u * Math.PI * 2;
    const s = Math.sin(t);
    const c = Math.cos(t);
    const d = 1 + s * s;
    // The strand rising from lower left to upper right passes over the other.
    return target.set(c / d, -((s * c) / d) * LOOP_HEIGHT, -CROSS_DEPTH * s);
  }
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export type Infinity3D = {
  /** Begin drawing the tube over `durationMs`. */
  start: (durationMs: number) => void;
  dispose: () => void;
};

/** Returns null when WebGL is unavailable, so the caller can fall back. */
export function createInfinity3D(host: HTMLElement): Infinity3D | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1.5), MAX_DPR));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  const canvas = renderer.domElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 2, 0.1, 20);
  camera.position.set(0, 0, CAMERA_DISTANCE);

  // Studio reflections, generated locally.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envMap = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envMap;
  room.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    (m.material as THREE.Material | undefined)?.dispose?.();
  });

  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.position.set(-0.4, 1.3, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 14;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -0.0005;
  const sc = key.shadow.camera;
  sc.left = -1.8;
  sc.right = 1.8;
  sc.top = 1.2;
  sc.bottom = -1.2;
  sc.near = 0.5;
  sc.far = 8;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.3);
  rim.position.set(2, 0.8, 1.5);
  scene.add(rim);

  // Brand colours along the tube: red left, magenta/purple centre, blue right.
  const red = cssColor(host, "--brand-red", [0.86, 0.13, 0.15]);
  const magenta = cssColor(host, "--brand-magenta", [0.86, 0.11, 0.42]);
  const purple = cssColor(host, "--brand-purple", [0.4, 0.18, 0.7]);
  const blue = cssColor(host, "--brand-blue", [0.15, 0.3, 0.85]);
  const stops: [number, THREE.Color][] = [
    [-0.42, red],
    // Brand magenta leaned towards purple, as in the reference crossover.
    [-0.2, magenta.clone().lerp(purple, 0.4)],
    [0.02, purple],
    [0.38, blue],
  ];
  // Slightly deeper albedo so the white highlights read as gloss, not wash.
  for (const [, c] of stops) c.multiplyScalar(ALBEDO_DEPTH);
  const colorAt = (x: number, out: THREE.Color) => {
    const first = stops[0]!;
    const last = stops[stops.length - 1]!;
    if (x <= first[0]) return out.copy(first[1]);
    if (x >= last[0]) return out.copy(last[1]);
    for (let i = 1; i < stops.length; i++) {
      const [x1, c1] = stops[i]!;
      const [x0, c0] = stops[i - 1]!;
      if (x <= x1) return out.lerpColors(c0, c1, (x - x0) / (x1 - x0));
    }
    return out.copy(last[1]);
  };

  const curve = new InfinityCurve();
  curve.arcLengthDivisions = 1200;
  const tube = new THREE.TubeGeometry(curve, TUBULAR_SEGMENTS, TUBE_RADIUS, RADIAL_SEGMENTS, true);
  const pos = tube.getAttribute("position");
  const colors = new Float32Array(pos.count * 3);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    colorAt(pos.getX(i), tmp).toArray(colors, i * 3);
  }
  tube.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const fullCount = tube.index ? tube.index.count : pos.count;
  tube.setDrawRange(0, 0);

  const glossy = {
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 0.4,
  } satisfies THREE.MeshPhysicalMaterialParameters;
  const tubeMat = new THREE.MeshPhysicalMaterial({ ...glossy, vertexColors: true });
  const tubeMesh = new THREE.Mesh(tube, tubeMat);
  tubeMesh.castShadow = true;

  // Rounded caps that ride the growing ends of the tube.
  const capGeo = new THREE.SphereGeometry(TUBE_RADIUS, RADIAL_SEGMENTS, 24);
  const headMat = new THREE.MeshPhysicalMaterial({ ...glossy });
  const tailMat = new THREE.MeshPhysicalMaterial({ ...glossy });
  const head = new THREE.Mesh(capGeo, headMat);
  const tail = new THREE.Mesh(capGeo, tailMat);
  head.castShadow = tail.castShadow = true;
  head.visible = tail.visible = false;
  const startPoint = curve.getPointAt(0);
  tail.position.copy(startPoint);
  colorAt(startPoint.x, tailMat.color);

  const logo = new THREE.Group();
  logo.add(tubeMesh, head, tail);
  logo.rotation.set(START_TILT.x, START_TILT.y, 0);
  scene.add(logo);

  // White backdrop that only shows the soft shadow.
  const backdropGeo = new THREE.PlaneGeometry(8, 5);
  const backdropMat = new THREE.ShadowMaterial({ opacity: SHADOW_OPACITY });
  const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
  backdrop.position.z = -0.42;
  backdrop.receiveShadow = true;
  scene.add(backdrop);

  let startAt = -1;
  let duration = 1700;
  let pendingStart = false;
  let raf = 0;
  let last = 0;
  let disposed = false;
  const headPos = new THREE.Vector3();

  const setProgress = (p: number) => {
    if (p <= 0) {
      tube.setDrawRange(0, 0);
      head.visible = tail.visible = false;
      return;
    }
    if (p >= 1) {
      tube.setDrawRange(0, fullCount);
      head.visible = tail.visible = false;
      return;
    }
    const segs = Math.floor(p * TUBULAR_SEGMENTS);
    tube.setDrawRange(0, segs * RADIAL_SEGMENTS * 6);
    curve.getPointAt(p, headPos);
    head.position.copy(headPos);
    colorAt(headPos.x, headMat.color);
    head.visible = tail.visible = true;
  };

  const resize = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the whole logo in frame on narrow, tall boxes too.
    const fitWidth = 2.75 / (2 * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * camera.aspect);
    camera.position.z = Math.max(CAMERA_DISTANCE, fitWidth);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    if (pendingStart) {
      pendingStart = false;
      startAt = now;
    }
    const raw = startAt < 0 ? 0 : Math.min((now - startAt) / duration, 1);
    const p = easeInOutCubic(raw);
    setProgress(p);

    // Ease from the drawing tilt into the resting pose, then a gentle sway.
    const targetX = THREE.MathUtils.lerp(START_TILT.x, REST_TILT.x, p);
    const settledFor = raw >= 1 ? (now - startAt - duration) / 1000 : 0;
    const sway = raw >= 1 ? Math.sin(settledFor * 1.6) * IDLE_SWAY * Math.min(settledFor, 1) : 0;
    const targetY = THREE.MathUtils.lerp(START_TILT.y, REST_TILT.y, p) + sway;
    const k = 1 - Math.exp(-dt * SETTLE_RATE);
    logo.rotation.x += (targetX - logo.rotation.x) * k;
    logo.rotation.y += (targetY - logo.rotation.y) * k;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  // Compile shaders up front so drawing starts without a hitch.
  renderer.compile(scene, camera);
  resize();
  host.dataset["logoReady"] = "true";
  raf = requestAnimationFrame(frame);

  return {
    start(durationMs: number) {
      duration = durationMs;
      pendingStart = true;
    },
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      tube.dispose();
      capGeo.dispose();
      backdropGeo.dispose();
      tubeMat.dispose();
      headMat.dispose();
      tailMat.dispose();
      backdropMat.dispose();
      envMap.dispose();
      pmrem.dispose();
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
