(function (root, name, factory, modules) {
  if (typeof exports === "object") {
    module.exports = factory(modules);
  } else {
    root[name] = factory(modules);
  }
}(window || null, 'KOFAC_KBC', function (mods) {
  const private_exports = {};
  const public_exports = {};

  const setProp = (exp, module) => {
    Object.defineProperty(exp, module.name, {
      value: module.exp,
      writable: module.writable,
      enumerable: module.enumerable,
      configurable: module.configurable
    });

    if (module.acsmod == "public") {
      module.acsmod = 'private';
      setProp(public_exports, module)
    }
  }

  Object.defineProperty(public_exports, "addModule", {
    value: function addModule(m) {
      if (typeof m === 'function') {
        const module = {
          name: "",
          exp: null,
          writable: false,
          enumerable: true,
          configurable: false,
          acsmod: "public"
        }
        m(module, private_exports, public_exports);
        module.name = module.name || module.exp.name;
        setProp(private_exports, module)
      } else if (typeof m === 'object') {

        Object.keys(m).forEach(k => {
          const module = {
            name: k,
            exp: m[k].value,
            writable: m[k].writable || false,
            enumerable: (m[k].enumerable == null) ? true : m[k].enumerable,
            acsmod: m[k].acsmod || "public",
            configurable: (m[k].configurable == null) ? false : m[k].configurable,
          }
          setProp(private_exports, module)
        })
      }
    },
    writable: false,
    configurable: false,
    enumerable: false
  }); // 디파인 프로퍼티 인수 (객체 참조, 프로퍼티, 오브젝트 디스크립터 객체)

  if (mods && mods.length)
    mods.forEach(m => public_exports.addModule(m));

  return public_exports;
}, [
  (function BUTTON_LOCK(mod, EXP, PUB) {
    const BUTTON_LOCK = (function(){
      let btn_lock = true;

      return {
        isLock: function (){
          return btn_lock === true;
        },
        lock: function (){
          btn_lock = true;
        },
        release: function (){
          btn_lock = false;
        }
      };
    })();

    mod.exp = BUTTON_LOCK;
    mod.name = 'BUTTON_LOCK';
  }),
  (function FINGERGUIDE(mod) {
    function FINGERGUIDE() {
      console.log('fingerguide');
    };

    mod.exp = FINGERGUIDE;
    mod.name = "FINGERGUIDE";
  }),
  (function FINGER_POINT(mod, EXP, PUB) {
    function FINGER_POINT () {
      
    }
  })
]));