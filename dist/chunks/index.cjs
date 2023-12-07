'use strict';

const vue = require('vue');

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

exports.useRenderClock = useRenderClock;
