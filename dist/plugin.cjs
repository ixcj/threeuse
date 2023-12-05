'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Stats = require('three/examples/jsm/libs/stats.module.js');
const index = require('./chunks/index.cjs');
require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const Stats__default = /*#__PURE__*/_interopDefaultLegacy(Stats);

const stats = {
  install: (app, ...options) => {
    const [
      show = true,
      followContainer = true
    ] = options;
    if (!show)
      return;
    const stats2 = new Stats__default();
    app.globalProperties.$stats = stats2;
    app.globalProperties.$stats.showPanel(0);
    const statsDom = app.globalProperties.$stats.dom;
    if (followContainer) {
      app.subscribe({
        mount: () => {
          statsDom.style.setProperty("position", "absolute");
          app.getContainer().appendChild(statsDom);
        },
        unmount: () => {
          statsDom.remove();
        }
      });
    } else {
      document.body.appendChild(statsDom);
    }
    index.useRenderClock(() => {
      stats2.update();
    });
  }
};

exports.stats = stats;
