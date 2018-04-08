const script = document.getElementById("introspectScript");

const specialRequire = require.context(".");

const getQuery = href => {
  const link = document.createElement("a");
  link.href = href;
  return link.search.slice(1);
};
const extensionId = getQuery(script.src);

const overrides = {
  "ChatInput.react": "./ChatInput",
  "ChatTabComposer.react": "./ChatTabComposer"
};

const customDefine = define => (name, deps, factory, ...args) => {
  if (overrides.hasOwnProperty(name)) {
    // __d expects the factory function to have a length of 10
    const newFactory = function(a1, req, a3, a4, mod, a5, a6, a7, a8, a9, a10) {
      factory(a1, req, a3, a4, mod, a5, a6, a7, a8, a9, a10);
      const override = specialRequire(overrides[name]).default;
      mod.exports = override(req, mod.exports, extensionId);
    };
    return define(name, deps, newFactory);
  }
  return define(name, deps, factory, ...args);
};

if (window.__d) {
  console.log("Can't apply hook");
} else {
  console.log("Applying hook.");
}
let define = window.__d ? customDefine(window.__d) : undefined;
Object.defineProperty(window, "__d", {
  get() {
    return define;
  },
  set(newValue) {
    console.log("Hook applied");
    define = customDefine(newValue);
  }
});
