import { reactive, watchEffect, ref } from 'vue';

const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";

let lastUpdatedTimestamp;
let requestId = null;
const renderFunctionMap = reactive(/* @__PURE__ */ new Map());
function render() {
  const newLastUpdatedTimestamp = new Date().getTime();
  const timeDifference = newLastUpdatedTimestamp - lastUpdatedTimestamp;
  lastUpdatedTimestamp = newLastUpdatedTimestamp;
  if (renderFunctionMap.size) {
    requestId = globalThis.requestAnimationFrame(render);
    if (timeDifference !== 0) {
      renderFunctionMap.forEach((fn) => {
        if (isFunction(fn)) {
          try {
            fn(timeDifference);
          } catch (err) {
            console.error(err);
          }
        }
      });
    }
  }
}
watchEffect(() => {
  if (renderFunctionMap.size) {
    if (requestId === null) {
      lastUpdatedTimestamp = new Date().getTime();
      render();
    }
  } else {
    if (requestId !== null) {
      globalThis.cancelAnimationFrame(requestId);
      requestId = null;
    }
  }
});
function useRenderClock(fn, options = {}) {
  const {
    key = Symbol(),
    activate = true
  } = options;
  const start = ref(activate);
  watchEffect(() => {
    if (start.value) {
      renderFunctionMap.set(key, fn);
    } else {
      renderFunctionMap.delete(key);
    }
  });
  return {
    start,
    key
  };
}

export { isString as a, isFunction as i, renderFunctionMap as r, useRenderClock as u };
