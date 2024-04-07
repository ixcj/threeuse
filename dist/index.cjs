'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./chunks/index.cjs');
const vue = require('vue');
const three = require('three');
const OrbitControls_js = require('three/examples/jsm/controls/OrbitControls.js');
const Sky_js = require('three/examples/jsm/objects/Sky.js');
const TWEEN = require('@tweenjs/tween.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const TWEEN__default = /*#__PURE__*/_interopDefaultLegacy(TWEEN);

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
function normalizeContainer(container) {
  if (index.isString(container)) {
    return document.querySelector(container);
  }
  return container;
}
function createRefProxy(target) {
  return new Proxy(target, {
    get(obj, prop) {
      return obj.value[prop];
    }
  });
}

class ThreeUse {
  constructor(options = {}) {
    this._controls = vue.ref(null);
    this._events = {};
    this._resizeObserver = new ResizeObserver(() => this._resize());
    this._size = { width: 0, height: 0, devicePixelRatio: 1 };
    this.mounted = false;
    this.enableCustomRender = false;
    this.globalProperties = {};
    this._customRender = void 0;
    this._resize = debounce(
      () => {
        if (this.mounted) {
          this._setSize();
          this.send("resize");
        }
      },
      16,
      true
    );
    const {
      clearColor = "#181818",
      cameraPosition = [0, 0, 0],
      outputColorSpace = three.LinearSRGBColorSpace
    } = options;
    this._renderer = new three.WebGLRenderer({
      alpha: true,
      antialias: true,
      failIfMajorPerformanceCaveat: true
    });
    this._scene = new three.Scene();
    this._domElement = this._renderer.domElement;
    this._renderer.shadowMap.enabled = true;
    this._renderer.outputColorSpace = outputColorSpace;
    clearColor && this._renderer.setClearColor(new three.Color(clearColor));
    this._camera = vue.ref(new three.PerspectiveCamera(35, 16 / 9, 0.1, 1e4));
    this._camera.value.position.set(...cameraPosition);
  }
  _setSize() {
    this._size.width = this._container.value?.clientWidth || 0;
    this._size.height = this._container.value?.clientHeight || 0;
    this._size.devicePixelRatio = devicePixelRatio || 1;
    const aspect = this._size.width / this._size.height;
    if (this._camera.value instanceof three.PerspectiveCamera) {
      this._camera.value.aspect = aspect;
    }
    this._camera.value.updateProjectionMatrix();
    this._renderer.setSize(this._size.width, this._size.height);
    this._renderer.setPixelRatio(this._size.devicePixelRatio);
  }
  _render() {
    requestAnimationFrame(this._render.bind(this));
    if (this.enableCustomRender && index.isFunction(this._customRender)) {
      this._customRender(this._scene, this._camera.value, this);
    } else {
      this._renderer.render(this._scene, this._camera.value);
    }
  }
  getRenderer() {
    return this._renderer;
  }
  getDom() {
    return this._domElement;
  }
  getScene() {
    return this._scene;
  }
  getContainer() {
    return createRefProxy(this._container);
  }
  getControls() {
    return createRefProxy(this._controls);
  }
  getCamera() {
    return createRefProxy(this._camera);
  }
  setControls(controls) {
    this._controls = vue.ref(controls);
    return this.getControls();
  }
  setCamera(camera) {
    this._camera = vue.ref(camera);
    return this.getCamera();
  }
  use(plugin, ...options) {
    if (index.isFunction(plugin)) {
      plugin(this, options);
    } else if (plugin && index.isFunction(plugin.install)) {
      plugin.install(this, options);
    }
    return this;
  }
  mount(rootContainer) {
    const container = normalizeContainer(rootContainer);
    if (container) {
      this._container = vue.ref(container);
      this._resizeObserver.observe(this._container.value);
      container.appendChild(this._domElement);
      this.mounted = true;
      this._resize();
      this._render();
      if (!this._controls.value) {
        this.setControls(new OrbitControls_js.OrbitControls(this._camera.value, this._domElement));
        this._controls.value.target = new three.Vector3(0, 0, 0);
      }
      this.send("mount");
    }
    return this;
  }
  unmount() {
    const domElement = this._domElement;
    if (domElement) {
      domElement.remove();
      this.mounted = false;
      this.send("unmount");
    }
    return this;
  }
  on(eventName, listener) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(listener);
  }
  off(eventName, listenerToRemove) {
    if (!this._events[eventName])
      return;
    this._events[eventName] = this._events[eventName].filter(
      (listener) => listener !== listenerToRemove
    );
  }
  send(eventName, ...args) {
    if (this._events[eventName]) {
      this._events[eventName].forEach((listener) => {
        listener(...args);
      });
    }
  }
  subscribe(behavior) {
    Object.entries(behavior).forEach(([eventName, listener]) => {
      this.on(eventName, listener);
    });
  }
  unsubscribe(behavior) {
    Object.entries(behavior).forEach(([eventName, listener]) => {
      this.off(eventName, listener);
    });
  }
}

function createThreeUseApp(options = {}) {
  const app = new ThreeUse(options);
  const proxyApp = new Proxy(app, {
    get(target, property) {
      return target[property] ?? app.globalProperties[property];
    }
  });
  return proxyApp;
}

const formattedDecimalMode = ["round", "floor", "ceil"];
function formattedDecimal(num, decimals = 2, mode = formattedDecimalMode[0]) {
  const multiple = Math.pow(10, decimals);
  const modeMethod = formattedDecimalMode.includes(mode) ? Math[mode] : Math.round;
  return modeMethod(num * multiple) / multiple;
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
  const index$1 = vue.ref(initialIndex);
  const endIdex = vue.ref(mode === "SlowFill" ? index$1.value : index$1.value + length);
  let displayDataLength = 0;
  const displayData = vue.computed(() => {
    const _displayData = dataCopy.slice(index$1.value, endIdex.value);
    displayDataLength = _displayData.length;
    return _displayData;
  });
  vue.watchEffect(() => {
    let newEndIdex = index$1.value + length;
    if (mode === "SlowFill" && displayDataLength < length) {
      newEndIdex = displayDataLength + 1;
    }
    endIdex.value = newEndIdex;
  });
  const start = vue.ref(activate);
  let remainderOfLastUpdate = 0;
  const { start: startRender, key } = index.useRenderClock((d) => {
    const newNumber_float = formattedDecimal(d / interval + remainderOfLastUpdate, 4);
    remainderOfLastUpdate = formattedDecimal(newNumber_float % 1, 4);
    const newNumber = Math.floor(newNumber_float);
    if (newNumber) {
      if (index$1.value + length < dataCopy.length) {
        if (mode === "SlowFill" && displayData.value.length < length) {
          endIdex.value = index$1.value + displayData.value.length + newNumber;
        } else {
          index$1.value += newNumber;
        }
      } else {
        index$1.value = 0;
        endIdex.value = index$1.value + length;
      }
    }
  });
  vue.watch(
    start,
    (val) => {
      remainderOfLastUpdate = 0;
      startRender.value = val;
    },
    { immediate: true }
  );
  return {
    displayData,
    index: index$1,
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
  const { start } = index.useRenderClock(() => {
    tween?.update();
  }, { activate: false });
  const sky = new Sky_js.Sky();
  sky.name = "_sky_.box";
  sky.scale.setScalar(size);
  const value = vue.ref(defaultValue);
  let oldVal = defaultValue;
  const control = vue.ref({
    turbidity: 0,
    rayleigh: 0.223,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    elevation: 12.2,
    azimuth: 180
  });
  let sun = new three.Vector3(0, 0, 0);
  let sunLight;
  if (showSunLight) {
    sunLight = scene.getObjectByName(sunLightName);
    !sunLight && (sunLight = createSunLight(sunLightName, size));
  }
  if (showSunLight && castShadowList && castShadowList.length) {
    scene.traverse((node) => {
      if (node instanceof three.Mesh) {
        node.receiveShadow = true;
        if (isChildren(castShadowList, node, castShadowNumber)) {
          node.castShadow = true;
          node.material.side = three.FrontSide;
        }
      }
    });
  }
  sky.position.set(...position);
  scene.add(sky);
  vue.watch(
    value,
    (newValue, oldValue) => {
      oldVal = oldValue || defaultValue;
      control.value = getControlOptions(newValue);
    },
    { immediate: true }
  );
  vue.watch(
    control,
    (val) => {
      tween?.stop();
      const elevationRatio = val.elevation / 65;
      const oldSun = sun.clone();
      const newSun = sun.clone();
      const phi = three.MathUtils.degToRad(90 - val.elevation);
      const theta = three.MathUtils.degToRad(val.azimuth);
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
        tween = new TWEEN__default.Tween(before).to(after).duration(Math.abs(value.value - oldVal) * durationMultiple).easing(TWEEN__default.Easing.Linear.None).onUpdate((params) => onUpdate(params, updateCallback)).onComplete(() => {
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
    sun = new three.Vector3(params.sunX, params.sunY, params.sunZ);
    sky.material.uniforms["sunPosition"].value.copy(sun);
    sunLight.position.set(sun.x, sun.y, sun.z);
    sunLight.intensity = params.intensity;
    var color1 = new three.Color(15237965);
    var color2 = new three.Color(14805220);
    sunLight.color.set(new three.Color().lerpColors(color1, color2, params.percent));
    if (index.isFunction(fn)) {
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
  const sunLight = new three.DirectionalLight(16777215, 1);
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

exports.renderFunctionMap = index.renderFunctionMap;
exports.useRenderClock = index.useRenderClock;
exports.TIME_MAX = TIME_MAX;
exports.TIME_MIN = TIME_MIN;
exports.TIME_RANGE = TIME_RANGE;
exports.TIME_RANGE_MEDIAN = TIME_RANGE_MEDIAN;
exports.createThreeUseApp = createThreeUseApp;
exports["default"] = ThreeUse;
exports.useRollingData = useRollingData;
exports.useSkyBox = useSkyBox;
