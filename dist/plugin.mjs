import Stats from 'three/examples/jsm/libs/stats.module';
import { u as useRenderClock } from './chunks/index.mjs';
import 'vue';

const stats = {
  install: (app, options) => {
    const [
      show = true,
      followContainer = true
    ] = options;
    if (!show)
      return;
    const stats2 = new Stats();
    const statsDom = stats2.dom;
    const { start } = useRenderClock(() => {
      stats2.update();
    }, { activate: false });
    if (followContainer) {
      statsDom.style.setProperty("position", "absolute");
      statsDom.style.setProperty("z-index", "9");
      app.subscribe({
        mount: () => {
          mount(app.getContainer());
        },
        unmount: () => {
          statsDom.remove();
          start.value = false;
        }
      }, "ThreeUse.Plugin.Stats");
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
    const { start } = useRenderClock(() => {
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
    }, "ThreeUse.Plugin.CameraRange");
  }
};

export { cameraRange, stats };
