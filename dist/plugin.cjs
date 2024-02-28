'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Stats = require('three/examples/jsm/libs/stats.module.js');
const index = require('./chunks/index.cjs');
require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const Stats__default = /*#__PURE__*/_interopDefaultLegacy(Stats);

const stats = {
  install: (app, options) => {
    const [
      show = true,
      followContainer = true
    ] = options;
    if (!show)
      return;
    const stats2 = new Stats__default();
    const statsDom = stats2.dom;
    const { start } = index.useRenderClock(() => {
      stats2.update();
    }, { activate: false });
    if (followContainer) {
      statsDom.style.setProperty("position", "absolute");
      statsDom.style.setProperty("z-index", "9999");
      app.subscribe({
        mount: () => {
          mount(app.getContainer());
        },
        unmount: () => {
          statsDom.remove();
          start.value = false;
        }
      });
    } else {
      mount(document.body);
    }
    function mount(el) {
      app.globalProperties.$stats && app.globalProperties.$stats.dom.remove();
      el.appendChild(statsDom);
      app.globalProperties.$stats = stats2;
      start.value = true;
    }
  }
};

const cameraRange = {
  install: (app, options) => {
    const [
      range = {
        x: { min: -1950, max: 1950 },
        y: { min: 1, max: 1950 },
        z: { min: -1950, max: 1950 }
      }
    ] = options;
    const camera = app.getCamera();
    const { start } = index.useRenderClock(() => {
      Object.keys(range).forEach((key) => {
        const { min, max } = range[key];
        camera.position[key] < min && (camera.position[key] = min);
        camera.position[key] > max && (camera.position[key] = max);
      });
    }, { activate: app.mounted });
    app.subscribe({
      mount: () => {
        start.value = true;
      },
      unmount: () => {
        start.value = false;
      }
    });
  }
};

exports.cameraRange = cameraRange;
exports.stats = stats;
