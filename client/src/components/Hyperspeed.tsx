import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";

import "./Hyperspeed.css";

interface Distortion {
  uniforms: Record<string, { value: any }>;
  getDistortion: string;
  getJS?: (progress: number, time: number) => THREE.Vector3;
}

interface Colors {
  roadColor: number;
  islandColor: number;
  background: number;
  shoulderLines: number;
  brokenLines: number;
  leftCars: number[];
  rightCars: number[];
  sticks: number;
}

export interface HyperspeedOptions {
  onSpeedUp?: (ev: MouseEvent | TouchEvent) => void;
  onSlowDown?: (ev: MouseEvent | TouchEvent) => void;
  distortion?: string | Distortion;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  carLightsFade: number;
  totalSideLightSticks: number;
  lightPairsPerRoadWay: number;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
  lightStickWidth: [number, number];
  lightStickHeight: [number, number];
  movingAwaySpeed: [number, number];
  movingCloserSpeed: [number, number];
  carLightsLength: [number, number];
  carLightsRadius: [number, number];
  carWidthPercentage: [number, number];
  carShiftX: [number, number];
  carFloorSeparation: [number, number];
  colors: Colors;
  followCursor?: boolean;
}

interface HyperspeedProps {
  effectOptions?: Partial<HyperspeedOptions>;
}

const xyUniforms = {
  uFreq: { value: new THREE.Vector2(5, 2) },
  uAmp: { value: new THREE.Vector2(25, 15) },
};

const distortions: Record<string, Distortion> = {
  xyDistortion: {
    uniforms: xyUniforms,
    getDistortion: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float movementProgressFix = 0.02;
        return vec3(
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
          0.
        );
      }
    `,
    getJS: (progress: number, time: number) => {
      const movementProgressFix = 0.02;
      const uFreq = xyUniforms.uFreq.value;
      const uAmp = xyUniforms.uAmp.value;
      const distortion = new THREE.Vector3(
        Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
          Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
        Math.sin(progress * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y -
          Math.sin(movementProgressFix * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y,
        0
      );
      const lookAtAmp = new THREE.Vector3(2, 0.4, 1);
      const lookAtOffset = new THREE.Vector3(0, 0, -3);
      return distortion.multiply(lookAtAmp).add(lookAtOffset);
    },
  },
};

export const hyperspeedPresets: Record<string, HyperspeedOptions> = {
  three: {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: "xyDistortion",
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 3,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 30,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.02, 0.05],
    lightStickHeight: [0.3, 0.7],
    movingAwaySpeed: [20, 50],
    movingCloserSpeed: [-150, -230],
    carLightsLength: [400 * 0.05, 400 * 0.2],
    carLightsRadius: [0.03, 0.08],
    carWidthPercentage: [0.1, 0.5],
    carShiftX: [-0.5, 0.5],
    carFloorSeparation: [0, 0.1],
    followCursor: true,
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff102a, 0xeb383e, 0xff102a],
      rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
      sticks: 0xdadafa,
    },
  },
};

const defaultOptions: HyperspeedOptions = hyperspeedPresets.three;

function random(base: number | [number, number]): number {
  if (Array.isArray(base)) {
    return Math.random() * (base[1] - base[0]) + base[0];
  }
  return Math.random() * base;
}

function pickRandom<T>(arr: T | T[]): T {
  if (Array.isArray(arr)) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return arr;
}

function lerp(current: number, target: number, speed = 0.1, limit = 0.001): number {
  let change = (target - current) * speed;
  if (Math.abs(change) < limit) {
    change = target - current;
  }
  return change;
}

const carLightsFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  varying vec3 vColor;
  varying vec2 vUv;
  uniform vec2 uFade;
  void main() {
    vec3 color = vec3(vColor);
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const carLightsVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  attribute vec3 aOffset;
  attribute vec3 aMetrics;
  attribute vec3 aColor;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vColor;
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;

    transformed.xy *= radius;
    transformed.z *= myLength;

    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

const sideSticksFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  varying vec3 vColor;
  void main(){
    vec3 color = vec3(vColor);
    gl_FragColor = vec4(color,1.);
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const sideSticksVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  attribute float aOffset;
  attribute vec3 aColor;
  attribute vec2 aMetrics;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec3 vColor;
  mat4 rotationY( in float angle ) {
    return mat4(
      cos(angle), 0, sin(angle), 0,
      0, 1.0, 0, 0,
      -sin(angle), 0, cos(angle), 0,
      0, 0, 0, 1
    );
  }
  #include <getDistortion_vertex>
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x;
    float height = aMetrics.y;

    transformed.xy *= vec2(width, height);
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);

    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += - uTravelLength + time;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    transformed.y += height / 2.;
    transformed.x += -width / 2.;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

const roadMarkingsVars = `
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
`;

const roadMarkingsFragment = `
  uv.y = mod(uv.y + uTime * 0.05, 1.);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
  float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
  brokenLines = mix(brokenLines, sideLines, uv.x);
  color = mix(color, uBrokenLinesColor, brokenLines);
`;

const roadBaseFragment = `
  #define USE_FOG;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  #include <roadMarkings_vars>
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);
    #include <roadMarkings_fragment>
    gl_FragColor = vec4(color, 1.);
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const islandFragment = roadBaseFragment
  .replace("#include <roadMarkings_fragment>", "")
  .replace("#include <roadMarkings_vars>", "");

const roadFragment = roadBaseFragment
  .replace("#include <roadMarkings_vars>", roadMarkingsVars)
  .replace("#include <roadMarkings_fragment>", roadMarkingsFragment);

const roadVertex = `
  #define USE_FOG;
  uniform float uTime;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  uniform float uTravelLength;
  varying vec2 vUv;
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer, setSize: (width: number, height: number) => void) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    setSize(width, height);
  }
  return needResize;
}

class CarLights {
  webgl: App;
  options: HyperspeedOptions;
  colors: number[] | THREE.Color;
  speed: [number, number];
  fade: THREE.Vector2;
  mesh!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;

  constructor(
    webgl: App,
    options: HyperspeedOptions,
    colors: number[] | THREE.Color,
    speed: [number, number],
    fade: THREE.Vector2
  ) {
    this.webgl = webgl;
    this.options = options;
    this.colors = colors;
    this.speed = speed;
    this.fade = fade;
  }

  init() {
    const options = this.options;
    const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
    const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);

    const instanced = new THREE.InstancedBufferGeometry().copy(geometry as any) as THREE.InstancedBufferGeometry;
    instanced.instanceCount = options.lightPairsPerRoadWay * 2;

    const laneWidth = options.roadWidth / options.lanesPerRoad;
    const aOffset: number[] = [];
    const aMetrics: number[] = [];
    const aColor: number[] = [];

    const colorArray = Array.isArray(this.colors)
      ? this.colors.map((value) => new THREE.Color(value))
      : [new THREE.Color(this.colors)];

    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      const radius = random(options.carLightsRadius);
      const length = random(options.carLightsLength);
      const spd = random(this.speed);
      const carLane = i % options.lanesPerRoad;

      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;
      const carWidth = random(options.carWidthPercentage) * laneWidth;
      const carShiftX = random(options.carShiftX) * laneWidth;
      laneX += carShiftX;

      const offsetY = random(options.carFloorSeparation) + radius * 1.3;
      const offsetZ = -random(options.length);

      aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
      aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);

      aMetrics.push(radius, length, spd);
      aMetrics.push(radius, length, spd);

      const color = pickRandom(colorArray);
      aColor.push(color.r, color.g, color.b);
      aColor.push(color.r, color.g, color.b);
    }

    instanced.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
    instanced.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
    instanced.setAttribute("aColor", new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

    const material = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex,
      transparent: true,
      uniforms: Object.assign(
        {
          uTime: { value: 0 },
          uTravelLength: { value: options.length },
          uFade: { value: this.fade },
        },
        this.webgl.fogUniforms,
        (typeof options.distortion === "object" ? options.distortion.uniforms : {}) || {}
      ),
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        typeof options.distortion === "object" ? options.distortion.getDistortion : ""
      );
    };

    this.mesh = new THREE.Mesh(instanced, material);
    this.mesh.frustumCulled = false;
    this.webgl.scene.add(this.mesh);
  }

  update(time: number) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}

class LightsSticks {
  webgl: App;
  options: HyperspeedOptions;
  mesh!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;

  constructor(webgl: App, options: HyperspeedOptions) {
    this.webgl = webgl;
    this.options = options;
  }

  init() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const instanced = new THREE.InstancedBufferGeometry().copy(geometry as any) as THREE.InstancedBufferGeometry;
    const totalSticks = this.options.totalSideLightSticks;
    instanced.instanceCount = totalSticks;

    const stickOffset = this.options.length / Math.max(totalSticks - 1, 1);
    const aOffset: number[] = [];
    const aColor: number[] = [];
    const aMetrics: number[] = [];

    const color = new THREE.Color(this.options.colors.sticks);

    for (let i = 0; i < totalSticks; i++) {
      const width = random(this.options.lightStickWidth);
      const height = random(this.options.lightStickHeight);

      aOffset.push((i - 1) * stickOffset * 2 + stickOffset * Math.random());
      aColor.push(color.r, color.g, color.b);
      aMetrics.push(width, height);
    }

    instanced.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false));
    instanced.setAttribute("aColor", new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));
    instanced.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false));

    const material = new THREE.ShaderMaterial({
      fragmentShader: sideSticksFragment,
      vertexShader: sideSticksVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(
        {
          uTravelLength: { value: this.options.length },
          uTime: { value: 0 },
        },
        this.webgl.fogUniforms,
        (typeof this.options.distortion === "object" ? this.options.distortion.uniforms : {}) || {}
      ),
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        typeof this.options.distortion === "object" ? this.options.distortion.getDistortion : ""
      );
    };

    this.mesh = new THREE.Mesh(instanced, material);
    this.mesh.frustumCulled = false;
    this.webgl.scene.add(this.mesh);
  }

  update(time: number) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}

class Road {
  webgl: App;
  options: HyperspeedOptions;
  uTime: { value: number };
  leftRoadWay!: THREE.Mesh;
  rightRoadWay!: THREE.Mesh;
  island!: THREE.Mesh;

  constructor(webgl: App, options: HyperspeedOptions) {
    this.webgl = webgl;
    this.options = options;
    this.uTime = { value: 0 };
  }

  createPlane(side: number, isRoad: boolean) {
    const segments = 100;
    const geometry = new THREE.PlaneGeometry(
      isRoad ? this.options.roadWidth : this.options.islandWidth,
      this.options.length,
      20,
      segments
    );

    let uniforms: Record<string, { value: any }> = {
      uTravelLength: { value: this.options.length },
      uColor: { value: new THREE.Color(isRoad ? this.options.colors.roadColor : this.options.colors.islandColor) },
      uTime: this.uTime,
    };

    if (isRoad) {
      uniforms = Object.assign(uniforms, {
        uLanes: { value: this.options.lanesPerRoad },
        uBrokenLinesColor: { value: new THREE.Color(this.options.colors.brokenLines) },
        uShoulderLinesColor: { value: new THREE.Color(this.options.colors.shoulderLines) },
        uShoulderLinesWidthPercentage: { value: this.options.shoulderLinesWidthPercentage },
        uBrokenLinesLengthPercentage: { value: this.options.brokenLinesLengthPercentage },
        uBrokenLinesWidthPercentage: { value: this.options.brokenLinesWidthPercentage },
      });
    }

    const material = new THREE.ShaderMaterial({
      fragmentShader: isRoad ? roadFragment : islandFragment,
      vertexShader: roadVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(
        uniforms,
        this.webgl.fogUniforms,
        (typeof this.options.distortion === "object" ? this.options.distortion.uniforms : {}) || {}
      ),
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        typeof this.options.distortion === "object" ? this.options.distortion.getDistortion : ""
      );
    };

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -this.options.length / 2;
    mesh.position.x += (this.options.islandWidth / 2 + this.options.roadWidth / 2) * side;
    this.webgl.scene.add(mesh);
    return mesh;
  }

  init() {
    this.leftRoadWay = this.createPlane(-1, true);
    this.rightRoadWay = this.createPlane(1, true);
    this.island = this.createPlane(0, false);
  }

  update(time: number) {
    this.uTime.value = time;
  }
}

class App {
  container: HTMLElement;
  options: HyperspeedOptions;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  disposed: boolean;
  road: Road;
  leftCarLights: CarLights;
  rightCarLights: CarLights;
  leftSticks: LightsSticks;
  fogUniforms: Record<string, { value: any }>;
  fovTarget: number;
  speedUpTarget: number;
  speedUp: number;
  timeOffset: number;
  pointerTarget: THREE.Vector2;
  pointerCurrent: THREE.Vector2;
  lookAtTarget: THREE.Vector3;

  onWindowResize: () => void;
  onMouseDown: (ev: MouseEvent) => void;
  onMouseUp: (ev: MouseEvent) => void;
  onTouchStart: (ev: TouchEvent) => void;
  onTouchEnd: (ev: TouchEvent) => void;
  onContextMenu: (ev: MouseEvent) => void;
  onPointerMove: (ev: MouseEvent) => void;
  onPointerLeave: () => void;

  constructor(container: HTMLElement, options: HyperspeedOptions) {
    this.container = container;
    this.options = {
      ...options,
      distortion:
        typeof options.distortion === "string"
          ? distortions[options.distortion] || distortions.xyDistortion
          : options.distortion,
    };

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.composer = new EffectComposer(this.renderer);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      this.options.fov,
      container.offsetWidth / container.offsetHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 8, -5);

    this.scene = new THREE.Scene();
    this.scene.background = null;
    const fog = new THREE.Fog(this.options.colors.background, this.options.length * 0.2, this.options.length * 500);
    this.scene.fog = fog;
    this.fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far },
    };

    this.clock = new THREE.Clock();
    this.disposed = false;

    this.road = new Road(this, this.options);
    this.leftCarLights = new CarLights(
      this,
      this.options,
      this.options.colors.leftCars,
      this.options.movingAwaySpeed,
      new THREE.Vector2(0, 1 - this.options.carLightsFade)
    );
    this.rightCarLights = new CarLights(
      this,
      this.options,
      this.options.colors.rightCars,
      this.options.movingCloserSpeed,
      new THREE.Vector2(1, 0 + this.options.carLightsFade)
    );
    this.leftSticks = new LightsSticks(this, this.options);

    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
    this.speedUp = 0;
    this.timeOffset = 0;
    this.pointerTarget = new THREE.Vector2(0, 0);
    this.pointerCurrent = new THREE.Vector2(0, 0);
    this.lookAtTarget = new THREE.Vector3();

    this.onWindowResize = this.handleWindowResize.bind(this);
    this.onMouseDown = this.handleMouseDown.bind(this);
    this.onMouseUp = this.handleMouseUp.bind(this);
    this.onTouchStart = this.handleTouchStart.bind(this);
    this.onTouchEnd = this.handleTouchEnd.bind(this);
    this.onContextMenu = this.handleContextMenu.bind(this);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerLeave = this.handlePointerLeave.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener("resize", this.onWindowResize);
  }

  handleWindowResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.composer.setSize(width, height);
  }

  initPasses() {
    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomPass = new EffectPass(
      this.camera,
      new BloomEffect({ luminanceThreshold: 0.2, luminanceSmoothing: 0, resolutionScale: 1 })
    );

    const smaaPass = new EffectPass(this.camera, new SMAAEffect({ preset: SMAAPreset.MEDIUM }));
    renderPass.renderToScreen = false;
    bloomPass.renderToScreen = false;
    smaaPass.renderToScreen = true;

    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);
    this.composer.addPass(smaaPass);
  }

  loadAssets(): Promise<void> {
    return new Promise((resolve) => {
      const manager = new THREE.LoadingManager(resolve);
      const searchImage = new Image();
      const areaImage = new Image();

      searchImage.addEventListener("load", () => manager.itemEnd("smaa-search"));
      areaImage.addEventListener("load", () => manager.itemEnd("smaa-area"));

      manager.itemStart("smaa-search");
      manager.itemStart("smaa-area");

      searchImage.src = SMAAEffect.searchImageDataURL;
      areaImage.src = SMAAEffect.areaImageDataURL;
    });
  }

  init() {
    this.initPasses();

    this.road.init();
    this.leftCarLights.init();
    this.leftCarLights.mesh.position.setX(-this.options.roadWidth / 2 - this.options.islandWidth / 2);
    this.rightCarLights.init();
    this.rightCarLights.mesh.position.setX(this.options.roadWidth / 2 + this.options.islandWidth / 2);
    this.leftSticks.init();
    this.leftSticks.mesh.position.setX(-(this.options.roadWidth + this.options.islandWidth / 2));

    this.container.addEventListener("mousedown", this.onMouseDown);
    this.container.addEventListener("mouseup", this.onMouseUp);
    this.container.addEventListener("mouseout", this.onMouseUp);
    this.container.addEventListener("touchstart", this.onTouchStart, { passive: true });
    this.container.addEventListener("touchend", this.onTouchEnd, { passive: true });
    this.container.addEventListener("touchcancel", this.onTouchEnd, { passive: true });
    this.container.addEventListener("contextmenu", this.onContextMenu);
    this.container.addEventListener("mousemove", this.onPointerMove);
    this.container.addEventListener("mouseleave", this.onPointerLeave);

    this.tick();
  }

  handleMouseDown(ev: MouseEvent) {
    this.options.onSpeedUp?.(ev);
    this.fovTarget = this.options.fovSpeedUp;
    this.speedUpTarget = this.options.speedUp;
  }

  handleMouseUp(ev: MouseEvent) {
    this.options.onSlowDown?.(ev);
    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
  }

  handleTouchStart(ev: TouchEvent) {
    this.options.onSpeedUp?.(ev);
    this.fovTarget = this.options.fovSpeedUp;
    this.speedUpTarget = this.options.speedUp;
  }

  handleTouchEnd(ev: TouchEvent) {
    this.options.onSlowDown?.(ev);
    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
  }

  handleContextMenu(ev: MouseEvent) {
    ev.preventDefault();
  }

  handlePointerMove(ev: MouseEvent) {
    if (!this.options.followCursor) {
      return;
    }
    const rect = this.container.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
    this.pointerTarget.set(x, y);
  }

  handlePointerLeave() {
    this.pointerTarget.set(0, 0);
  }

  update(delta: number) {
    const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
    this.speedUp += lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001);
    this.timeOffset += this.speedUp * delta;
    const time = this.clock.elapsedTime + this.timeOffset;

    this.rightCarLights.update(time);
    this.leftCarLights.update(time);
    this.leftSticks.update(time);
    this.road.update(time);

    this.pointerCurrent.x += lerp(this.pointerCurrent.x, this.pointerTarget.x, lerpPercentage, 0.00001) * delta * 6;
    this.pointerCurrent.y += lerp(this.pointerCurrent.y, this.pointerTarget.y, lerpPercentage, 0.00001) * delta * 6;

    let updateCamera = false;
    const fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
    if (fovChange !== 0) {
      this.camera.fov += fovChange * delta * 6;
      updateCamera = true;
    }

    this.lookAtTarget.set(this.camera.position.x, this.camera.position.y, this.camera.position.z - 10);
    if (typeof this.options.distortion === "object" && this.options.distortion.getJS) {
      const distortion = this.options.distortion.getJS(0.025, time);
      this.lookAtTarget.set(
        this.camera.position.x + distortion.x,
        this.camera.position.y + distortion.y,
        this.camera.position.z + distortion.z
      );
      updateCamera = true;
    }

    if (this.options.followCursor) {
      this.lookAtTarget.x += this.pointerCurrent.x * 2;
      this.lookAtTarget.y += this.pointerCurrent.y * 1.25;
      updateCamera = true;
    }

    if (updateCamera) {
      this.camera.lookAt(this.lookAtTarget);
      this.camera.updateProjectionMatrix();
    }
  }

  render(delta: number) {
    this.composer.render(delta);
  }

  setSize(width: number, height: number) {
    this.composer.setSize(width, height);
  }

  tick() {
    if (this.disposed) {
      return;
    }
    if (resizeRendererToDisplaySize(this.renderer, this.setSize.bind(this))) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    const delta = this.clock.getDelta();
    this.render(delta);
    this.update(delta);
    requestAnimationFrame(this.tick);
  }

  dispose() {
    this.disposed = true;

    window.removeEventListener("resize", this.onWindowResize);
    this.container.removeEventListener("mousedown", this.onMouseDown);
    this.container.removeEventListener("mouseup", this.onMouseUp);
    this.container.removeEventListener("mouseout", this.onMouseUp);
    this.container.removeEventListener("touchstart", this.onTouchStart);
    this.container.removeEventListener("touchend", this.onTouchEnd);
    this.container.removeEventListener("touchcancel", this.onTouchEnd);
    this.container.removeEventListener("contextmenu", this.onContextMenu);
    this.container.removeEventListener("mousemove", this.onPointerMove);
    this.container.removeEventListener("mouseleave", this.onPointerLeave);

    this.composer.dispose();
    this.renderer.dispose();
    this.scene.clear();
  }
}

const DEFAULT_EFFECT_OPTIONS: Partial<HyperspeedOptions> = {};

const Hyperspeed: FC<HyperspeedProps> = ({ effectOptions = DEFAULT_EFFECT_OPTIONS }) => {
  const hyperspeedRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    const container = hyperspeedRef.current;
    if (!container) {
      return;
    }

    if (appRef.current) {
      appRef.current.dispose();
      appRef.current = null;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const options: HyperspeedOptions = {
      ...defaultOptions,
      ...effectOptions,
      colors: { ...defaultOptions.colors, ...(effectOptions.colors || {}) },
    };

    const app = new App(container, options);
    appRef.current = app;
    app.loadAssets().then(() => app.init());

    return () => {
      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, [effectOptions]);

  return <div id="lights" ref={hyperspeedRef}></div>;
};

export default Hyperspeed;
