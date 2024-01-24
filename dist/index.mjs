import { i as isFunction, a as isString, u as useRenderClock } from './chunks/index.mjs';
export { r as renderFunctionMap, u as useRenderClock } from './chunks/index.mjs';
import { Scene, PerspectiveCamera, WebGLRenderer, Color, Vector3, LinearSRGBColorSpace, Mesh, FrontSide, MathUtils, DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ref, computed, watchEffect, watch } from 'vue';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import TWEEN from '@tweenjs/tween.js';

function debounce(func, delay, immediate = false) {
  let timer;
  return function(...args) {
    let that = this;
    if (immediate) {
      func.apply(that, args);
      immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(that, args);
    }, delay);
  };
}

class ThreeUse {
  constructor(options = {}) {
    this._resizeObserver = new ResizeObserver(() => this._resize());
    this._subscribe = /* @__PURE__ */ new Map();
    this._size = {
      width: 0,
      height: 0
    };
    this.mounted = false;
    this.globalProperties = {};
    this._customRender = void 0;
    this._resize = debounce(() => {
      this._setSize();
      this._setCamera();
      this._renderer.setPixelRatio(devicePixelRatio || 1);
      this._notify("resize");
    }, 16, true);
    const {
      clearColor = "#181818",
      cameraPosition = [0, 0, 0],
      fov = 35,
      aspect = 16 / 9,
      near = 0.5,
      far = 1e4,
      outputColorSpace = LinearSRGBColorSpace
    } = options;
    this._scene = new Scene();
    this._camera = new PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(...cameraPosition);
    this._renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      failIfMajorPerformanceCaveat: true
    });
    this._renderer.shadowMap.enabled = true;
    this._renderer.outputColorSpace = outputColorSpace;
    this._renderer.setClearColor(new Color(clearColor));
  }
  _setSize() {
    this._size.width = this._container?.clientWidth || 0;
    this._size.height = this._container?.clientHeight || 0;
  }
  _setCamera() {
    this._camera.aspect = this._size.width / this._size.height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._size.width, this._size.height);
  }
  _render() {
    requestAnimationFrame(this._render.bind(this));
    if (isFunction(this._customRender)) {
      this._customRender(this._scene, this._camera, this);
    } else {
      this._renderer.render(this._scene, this._camera);
    }
  }
  _notify(notifyType) {
    this._subscribe.forEach((behavior) => {
      const fn = behavior[notifyType];
      if (isFunction(fn)) {
        try {
          fn();
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
  getRenderer() {
    return this._renderer;
  }
  getDom() {
    return this._renderer.domElement;
  }
  getContainer() {
    return this._container;
  }
  getControls() {
    return this._controls;
  }
  getScene() {
    return this._scene;
  }
  getCamera() {
    return this._camera;
  }
  setControls(controls) {
    this._controls = controls;
    return this;
  }
  use(plugin, ...options) {
    if (isFunction(plugin)) {
      plugin(this, options);
    } else if (plugin && isFunction(plugin.install)) {
      plugin.install(this, options);
    }
    return this;
  }
  mount(rootContainer) {
    const container = normalizeContainer(rootContainer);
    if (container) {
      this._container = container;
      this._resizeObserver.observe(this._container);
      container.appendChild(this.getDom());
      this.mounted = true;
      this._resize();
      this._render();
      if (!this._controls) {
        this._controls = new OrbitControls(this._camera, this.getDom());
        this._controls.target = new Vector3(0, 0, 0);
      }
      this._notify("mount");
    }
    return this;
  }
  unmount() {
    const domElement = this.getDom();
    if (domElement) {
      domElement.remove();
      this.mounted = true;
      this._notify("unmount");
    }
    return this;
  }
  subscribe(behavior, key = Symbol()) {
    this._subscribe.set(key, behavior);
    return key;
  }
  unSubscribe(key) {
    this._subscribe.delete(key);
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    return document.querySelector(container);
  }
  return container;
}

function createApp(options = {}) {
  const app = new ThreeUse(options);
  const proxyApp = new Proxy(app, {
    get(target, property) {
      return target[property] ?? app.globalProperties[property];
    }
  });
  return proxyApp;
}

function formattedDecimal(n, d = 2) {
  const multiple = Math.pow(10, d);
  return Math.round(n * multiple) / multiple;
}

function useRollingData(data, options = {}) {
  const {
    length = 10,
    interval = 1e3,
    initialIndex = 0,
    activate = false,
    mode = "DirectFill"
  } = options;
  const dataCopy = [...data, ...data.slice(0, length)];
  const index = ref(initialIndex);
  const endIdex = ref(mode === "SlowFill" ? index.value : index.value + length);
  let displayDataLength = 0;
  const displayData = computed(() => {
    const _displayData = dataCopy.slice(index.value, endIdex.value);
    displayDataLength = _displayData.length;
    return _displayData;
  });
  watchEffect(() => {
    let newEndIdex = index.value + length;
    if (mode === "SlowFill" && displayDataLength < length) {
      newEndIdex = displayDataLength + 1;
    }
    endIdex.value = newEndIdex;
  });
  const start = ref(activate);
  let remainderOfLastUpdate = 0;
  const { start: startRender, key } = useRenderClock((d) => {
    const newNumber_float = formattedDecimal(d / interval + remainderOfLastUpdate, 4);
    remainderOfLastUpdate = formattedDecimal(newNumber_float % 1, 4);
    const newNumber = Math.floor(newNumber_float);
    if (newNumber) {
      if (index.value + length < dataCopy.length) {
        if (mode === "SlowFill" && displayData.value.length < length) {
          endIdex.value = index.value + displayData.value.length + newNumber;
        } else {
          index.value += newNumber;
        }
      } else {
        index.value = 0;
        endIdex.value = index.value + length;
      }
    }
  });
  watch(
    start,
    (val) => {
      remainderOfLastUpdate = 0;
      startRender.value = val;
    },
    { immediate: true }
  );
  return {
    displayData,
    index,
    endIdex,
    start,
    key
  };
}

const TIME_MIN = 0;
const TIME_MAX = 720;
const TIME_RANGE = TIME_MAX - TIME_MIN;
const TIME_RANGE_MEDIAN = TIME_RANGE / 2;
function useSkyBox(scene, options = {}) {
  const {
    defaultValue = 0,
    size = 4e3,
    position = [0, 0, 0],
    sunLightName = "_sky_.sunLight",
    showSunLight = true,
    castShadowList = [],
    castShadowNumber = 2,
    durationMultiple = 3,
    updateCallback = void 0
  } = options;
  let tween = null;
  const { start } = useRenderClock(() => {
    tween?.update();
  }, { activate: false });
  const sky = new Sky();
  sky.name = "_sky_.box";
  sky.scale.setScalar(size);
  const value = ref(defaultValue);
  let oldVal = defaultValue;
  const control = ref({
    turbidity: 0,
    rayleigh: 0.223,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    elevation: 12.2,
    azimuth: 180
  });
  let sun = new Vector3(0, 0, 0);
  let sunLight;
  if (showSunLight) {
    sunLight = scene.getObjectByName(sunLightName);
    !sunLight && (sunLight = createSunLight(sunLightName, size));
  }
  if (showSunLight && castShadowList && castShadowList.length) {
    scene.traverse((node) => {
      if (node instanceof Mesh) {
        node.receiveShadow = true;
        if (isChildren(castShadowList, node, castShadowNumber)) {
          node.castShadow = true;
          node.material.side = FrontSide;
        }
      }
    });
  }
  sky.position.set(...position);
  scene.add(sky);
  watch(
    value,
    (newValue, oldValue) => {
      oldVal = oldValue || defaultValue;
      control.value = getControlOptions(newValue);
    },
    { immediate: true }
  );
  watch(
    control,
    (val) => {
      tween?.stop();
      const elevationRatio = val.elevation / 65;
      const oldSun = sun.clone();
      const newSun = sun.clone();
      const phi = MathUtils.degToRad(90 - val.elevation);
      const theta = MathUtils.degToRad(val.azimuth);
      newSun.setFromSphericalCoords(size / 2, phi, theta);
      const before = {
        rayleigh: sky.material.uniforms["rayleigh"].value,
        turbidity: sky.material.uniforms["turbidity"].value,
        mieCoefficient: sky.material.uniforms["mieCoefficient"].value,
        mieDirectionalG: sky.material.uniforms["mieDirectionalG"].value,
        sunX: oldSun.x,
        sunY: oldSun.y,
        sunZ: oldSun.z,
        intensity: sunLight.intensity,
        percent: Math.abs(TIME_RANGE - oldVal) / TIME_RANGE
      };
      const after = {
        rayleigh: val.rayleigh,
        turbidity: val.turbidity,
        mieCoefficient: val.mieCoefficient,
        mieDirectionalG: val.mieDirectionalG,
        sunX: newSun.x,
        sunY: newSun.y,
        sunZ: newSun.z,
        intensity: value.value >= 0 ? (1 - 0.8 * (1 - elevationRatio)) * (elevationRatio > 0.2 ? 1.1 : 1) : 0.25,
        percent: Math.abs(TIME_RANGE - value.value) / TIME_RANGE
      };
      if (durationMultiple) {
        start.value = true;
        tween = new TWEEN.Tween(before).to(after).duration(Math.abs(value.value - oldVal) * durationMultiple).easing(TWEEN.Easing.Linear.None).onUpdate((params) => onUpdate(params, updateCallback)).onComplete(() => {
          start.value = false;
          onUpdate(after, updateCallback);
        }).start();
      } else {
        onUpdate(after, updateCallback);
      }
    },
    { immediate: true }
  );
  function onUpdate(params, fn) {
    sky.material.uniforms["rayleigh"].value = params.rayleigh;
    sky.material.uniforms["turbidity"].value = params.turbidity;
    sky.material.uniforms["mieCoefficient"].value = params.mieCoefficient;
    sky.material.uniforms["mieDirectionalG"].value = params.mieDirectionalG;
    sun = new Vector3(params.sunX, params.sunY, params.sunZ);
    sky.material.uniforms["sunPosition"].value.copy(sun);
    sunLight.position.set(sun.x, sun.y, sun.z);
    sunLight.intensity = params.intensity;
    var color1 = new Color(15237965);
    var color2 = new Color(14805220);
    sunLight.color.set(new Color().lerpColors(color1, color2, params.percent));
    if (isFunction(fn)) {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    }
  }
  return {
    value,
    control
  };
}
function createSunLight(name, size = 4e3) {
  const sunLight = new DirectionalLight(16777215, 1);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = size;
  sunLight.shadow.mapSize.height = size;
  sunLight.shadow.camera.left = -size / 2;
  sunLight.shadow.camera.bottom = -size / 2;
  sunLight.shadow.camera.right = size;
  sunLight.shadow.camera.top = size;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = size;
  sunLight.shadow.bias = 1e-4;
  sunLight.position.set(0, 0, 0);
  sunLight.name = name;
  return sunLight;
}
function isChildren(castShadowList, node, level = 2) {
  if (castShadowList.includes(node.name)) {
    return true;
  } else {
    return level >= 1 ? isChildren(castShadowList, node, level - 1) : false;
  }
}
function getControlOptions(time) {
  if (time === TIME_MIN)
    time = TIME_MIN + 1;
  if (time === TIME_MAX)
    time = TIME_MAX - 1;
  const value = time / TIME_RANGE;
  const medianValue = time / TIME_RANGE_MEDIAN;
  const medianRatio = 1 - (time - TIME_RANGE_MEDIAN) / TIME_RANGE_MEDIAN;
  const absMedianRatio = 1 - Math.abs(time - TIME_RANGE_MEDIAN) / TIME_RANGE_MEDIAN;
  if (time >= 0) {
    return {
      turbidity: formattedDecimal(value * 10),
      rayleigh: formattedDecimal(0.233 + value * 3 * medianValue),
      mieCoefficient: formattedDecimal(value * medianRatio * 0.3),
      mieDirectionalG: formattedDecimal(value * (200 * medianRatio)),
      elevation: formattedDecimal(absMedianRatio * 65),
      azimuth: formattedDecimal(200 - medianRatio * 90)
    };
  } else {
    return {
      turbidity: 1,
      rayleigh: 0.223,
      mieCoefficient: 0.2,
      mieDirectionalG: 100,
      elevation: 30,
      azimuth: 75
    };
  }
}

export { TIME_MAX, TIME_MIN, TIME_RANGE, TIME_RANGE_MEDIAN, createApp, ThreeUse as default, useRollingData, useSkyBox };
