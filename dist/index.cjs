'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const vue = require('vue');

let lastUpdatedTimestamp = new Date().getTime();
const registeredRenderFunctionMap = /* @__PURE__ */ new Map();
function render() {
  const newLastUpdatedTimestamp = new Date().getTime();
  const differenceValue = newLastUpdatedTimestamp - lastUpdatedTimestamp;
  lastUpdatedTimestamp = newLastUpdatedTimestamp;
  if (registeredRenderFunctionMap.size) {
    registeredRenderFunctionMap.forEach((fn) => fn(differenceValue));
  }
  if (typeof window !== "undefined") {
    window.requestAnimationFrame(render);
  }
}
render();

const render$1 = {
  __proto__: null,
  get lastUpdatedTimestamp () { return lastUpdatedTimestamp; },
  registeredRenderFunctionMap: registeredRenderFunctionMap
};

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
  const key = Symbol();
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
  vue.watch(
    start,
    (val) => {
      if (val) {
        registeredRenderFunctionMap.set(key, (d) => {
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
      } else {
        registeredRenderFunctionMap.delete(key);
      }
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

exports.render = render$1;
exports.useRollingData = useRollingData;
