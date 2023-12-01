'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const three = require('three');
const OrbitControls_js = require('three/examples/jsm/controls/OrbitControls.js');
const vue = require('vue');

const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";

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
    this._size = {
      width: 0,
      height: 0
    };
    this._customRender = void 0;
    this._resize = debounce(() => {
      this._setSize();
      this._setCamera();
    }, 50, true);
    this.globalProperties = {};
    const {
      clearColor = "#181818",
      cameraPosition = [0, 0, 0],
      targetPosition = [0, 0, 0],
      fov = 75,
      aspect = 16 / 9,
      near = 0.1,
      far = 1e3
    } = options;
    this._scene = new three.Scene();
    this._camera = new three.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(...cameraPosition);
    this._renderer = new three.WebGLRenderer({
      alpha: true,
      antialias: true,
      failIfMajorPerformanceCaveat: true
    });
    this._renderer.setClearColor(new three.Color(clearColor));
    this._controls = new OrbitControls_js.OrbitControls(this._camera, this._renderer.domElement);
    this._controls.target = new three.Vector3(...targetPosition);
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
    if (this._customRender instanceof Function) {
      this._customRender();
    } else {
      this._renderer.render(this._scene, this._camera);
    }
  }
  getDom() {
    return this._renderer.domElement;
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
      this._render();
      this._resize();
    }
    return this;
  }
  unmount() {
    const domElement = this.getDom();
    domElement && domElement.remove();
    return this;
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

let lastUpdatedTimestamp = new Date().getTime();
const registeredRenderFunctionMap = /* @__PURE__ */ new Map();
function render() {
  const newLastUpdatedTimestamp = new Date().getTime();
  const timeDifference = newLastUpdatedTimestamp - lastUpdatedTimestamp;
  lastUpdatedTimestamp = newLastUpdatedTimestamp;
  if (registeredRenderFunctionMap.size) {
    registeredRenderFunctionMap.forEach((fn) => fn(timeDifference));
  }
  if (typeof window !== "undefined") {
    window.requestAnimationFrame(render);
  }
}
render();
function useRenderClock(fn, options = {}) {
  const {
    key = Symbol(),
    activate = true
  } = options;
  const start = vue.ref(activate);
  vue.watchEffect(() => {
    if (start.value) {
      registeredRenderFunctionMap.set(key, fn);
    } else {
      registeredRenderFunctionMap.delete(key);
    }
  });
  return {
    start,
    key
  };
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
  const index = vue.ref(initialIndex);
  const endIdex = vue.ref(mode === "SlowFill" ? index.value : index.value + length);
  let displayDataLength = 0;
  const displayData = vue.computed(() => {
    const _displayData = dataCopy.slice(index.value, endIdex.value);
    displayDataLength = _displayData.length;
    return _displayData;
  });
  vue.watchEffect(() => {
    let newEndIdex = index.value + length;
    if (mode === "SlowFill" && displayDataLength < length) {
      newEndIdex = displayDataLength + 1;
    }
    endIdex.value = newEndIdex;
  });
  const start = vue.ref(activate);
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
    index,
    endIdex,
    start,
    key
  };
}

function useSky() {
}

exports.createApp = createApp;
exports["default"] = ThreeUse;
exports.useRenderClock = useRenderClock;
exports.useRollingData = useRollingData;
exports.useSky = useSky;
