import Stats from 'three/examples/jsm/libs/stats.module.js';
import { u as useRenderClock } from './chunks/index.mjs';
import 'vue';

const stats = {
  install: (app, ...options) => {
    const [
      show = true,
      followContainer = true
    ] = options;
    if (!show)
      return;
    const stats2 = new Stats();
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
    useRenderClock(() => {
      stats2.update();
    });
  }
};

export { stats };
